import React from 'react';

function WorldlineSelector({ worldlines, onSelect }) {
  const selectorStyle = {
    width: '80%',
    maxWidth: '800px',
    display: 'flex',
    justifyContent: 'space-around',
    gap: '20px',
    padding: '20px',
    border: '1px solid #444',
    borderRadius: '10px',
    backgroundColor: '#1a1a1a',
  };

  const worldlineStyle = {
    flex: 1,
    padding: '15px',
    border: '1px solid #61dafb',
    borderRadius: '8px',
    backgroundColor: '#282c34',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  };

  const divergenceTextStyle = {
    fontFamily: '"Courier New", Courier, monospace',
    color: '#ff8c00',
    textShadow: '0 0 3px #ff8c00',
    marginBottom: '10px',
    textAlign: 'center',
  };

  const buttonStyle = {
    padding: '10px',
    fontSize: '0.8em',
    backgroundColor: '#61dafb',
    color: '#282c34',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '15px',
  };

  return (
    <div style={selectorStyle}>
      {worldlines.map((line) => (
        <div key={line.id} style={worldlineStyle}>
          <div style={divergenceTextStyle}>{line.divergence}</div>
          <p style={{ fontSize: '0.8em', margin: 0 }}>{line.text.substring(0, 100)}...</p>
          <button style={buttonStyle} onClick={() => onSelect(line)}>
            Choose Timeline {line.id.toUpperCase()}
          </button>
        </div>
      ))}
    </div>
  );
}

export default WorldlineSelector;
