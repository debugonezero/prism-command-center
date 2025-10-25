import React, { useState, useEffect, useRef } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import './App.css';
import PromptInput from './components/PromptInput';
import ChatHistory from './components/ChatHistory';
import ProjectManager from './components/ProjectManager';
import { RotateCcw, RotateCw, XSquare } from 'react-feather';

function App() {
  const [messages, setMessages] = useState([]);
  const [undoneMessages, setUndoneMessages] = useState([]);
  const [savedProjects, setSavedProjects] = useState([]);
  const [currentProjectId, setCurrentProjectId] = useState(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const chatHistoryRef = useRef(null);

  // Effect for loading projects on startup
  useEffect(() => {
    const loadedProjects = JSON.parse(localStorage.getItem('dockracle_projects')) || [];
    setSavedProjects(loadedProjects);
    if (loadedProjects.length > 0) {
      handleLoadProject(loadedProjects[0].id);
    } else {
      handleNewProject();
    }
  }, []);

  // Effect for scrolling chat history
  useEffect(() => {
    if (chatHistoryRef.current) {
      const { scrollHeight, clientHeight } = chatHistoryRef.current;
      chatHistoryRef.current.scrollTop = scrollHeight - clientHeight;
    }
  }, [messages]);

  // Effect for setting up Tauri event listeners
  useEffect(() => {
    let unlistenToken, unlistenDone;

    const setupListeners = async () => {
      unlistenToken = await listen('llm_token', (event) => {
        setMessages(prev => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage) {
            const updatedLastMessage = {
              ...lastMessage,
              text: lastMessage.text + event.payload.token,
            };
            newMessages[newMessages.length - 1] = updatedLastMessage;
          }
          return newMessages;
        });
      });

      unlistenDone = await listen('llm_done', () => {
        setIsStreaming(false);
      });
    };

    setupListeners();

    return () => {
      unlistenToken && unlistenToken();
      unlistenDone && unlistenDone();
    };
  }, []);

  const handleSaveProject = () => {
    const projectName = prompt("Enter a name for this project:", `Project-${Date.now().toString().slice(-4)}`);
    if (!projectName) return;

    const newProject = {
      id: currentProjectId || Date.now(),
      name: projectName,
      messages: messages,
    };

    const projectExists = savedProjects.some(p => p.id === newProject.id);
    const updatedProjects = projectExists
      ? savedProjects.map(p => p.id === newProject.id ? newProject : p)
      : [newProject, ...savedProjects];

    setSavedProjects(updatedProjects);
    setCurrentProjectId(newProject.id);
    localStorage.setItem('dockracle_projects', JSON.stringify(updatedProjects));
    alert(`Project "${projectName}" saved!`);
  };

  const handleLoadProject = (projectId) => {
    const projectToLoad = savedProjects.find(p => p.id === projectId);
    if (projectToLoad) {
      setMessages(projectToLoad.messages);
      setCurrentProjectId(projectToLoad.id);
      setUndoneMessages([]);
    }
  };

  const handleNewProject = () => {
    setMessages([
      { sender: 'oracle', text: 'New Project Initialized. Awaiting Commands.' }
    ]);
    setCurrentProjectId(null);
    setUndoneMessages([]);
  };

  const handleUndo = () => {
    if (messages.length > 1) {
      const lastMessage = messages[messages.length - 1];
      const secondLastMessage = messages[messages.length - 2];
      if (lastMessage.sender === 'oracle' && secondLastMessage.sender === 'user') {
        setUndoneMessages([secondLastMessage, lastMessage]);
        setMessages(prev => prev.slice(0, -2));
      }
    }
  };

  const handleRedo = () => {
    if (undoneMessages.length > 0) {
      setMessages(prev => [...prev, ...undoneMessages]);
      setUndoneMessages([]);
    }
  };

  const handleInterrupt = () => {
    // Interrupting the stream is more complex now and requires backend changes.
    // For now, this button doesn't stop the generation, but the UI is enabled/disabled.
    console.log("Interrupt clicked. Backend implementation needed.");
  };

  const handleSendMessage = async (promptText) => {
    if (isStreaming) return;

    setIsStreaming(true);
    setUndoneMessages([]);
    const newUserMessage = { sender: 'user', text: promptText };
    setMessages(prev => [...prev, newUserMessage, { sender: 'oracle', text: '' }]);

    try {
      await invoke('summon_titan', { prompt: promptText });
    } catch (error) {
      console.error("Error summoning the titan:", error);
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1].text = `Error: Could not connect to the forge. ${error}`;
        return newMessages;
      });
      setIsStreaming(false);
    }
  };

  const canUndo = messages.length > 1 && !isStreaming;
  const canRedo = undoneMessages.length > 0 && !isStreaming;

  return (
    <div className="app-container">
      <ProjectManager
        savedProjects={savedProjects}
        currentProjectId={currentProjectId}
        onNewProject={handleNewProject}
        onSaveProject={handleSaveProject}
        onLoadProject={handleLoadProject}
      />
      <div className="main-content">
        <ChatHistory ref={chatHistoryRef} messages={messages} />
        <div className="input-area">
          <div className="input-area-wrapper">
            <div className="main-controls">
              <button onClick={handleUndo} disabled={!canUndo} className="button">
                <RotateCcw size={16} />
                <span>Undo</span>
              </button>
              <button onClick={handleRedo} disabled={!canRedo} className="button">
                <RotateCw size={16} />
                <span>Redo</span>
              </button>
              <button onClick={handleInterrupt} disabled={!isStreaming} className="button">
                <XSquare size={16} />
                <span>Stop</span>
              </button>
            </div>
            <PromptInput onSendMessage={handleSendMessage} disabled={isStreaming} />
          </div>
        </div>
      </div>
    </div>
  );
}
export default App;
