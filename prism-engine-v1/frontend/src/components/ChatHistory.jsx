import React, { forwardRef } from 'react';
import ReactMarkdown from 'react-markdown';

const ChatHistory = forwardRef(({ messages }, ref) => {
  return (
    <div ref={ref} className="chat-history">
      {messages.map((msg, index) => (
        <div key={index} className={`message ${msg.sender}`}>
          <div className="message-content">
            {msg.sender === 'oracle' ? (
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            ) : (
              msg.text
            )}
          </div>
        </div>
      ))}
    </div>
  );
});

export default ChatHistory;
