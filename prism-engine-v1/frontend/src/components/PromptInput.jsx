import React, { useState } from 'react';

function PromptInput({ onSendMessage }) {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (prompt.trim() === '') return;
    onSendMessage(prompt);
    setPrompt('');
  };

  return (
    <form onSubmit={handleSubmit} className="prompt-form">
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Summon the Oracle..."
        className="prompt-input"
      />
    </form>
  );
}

export default PromptInput;