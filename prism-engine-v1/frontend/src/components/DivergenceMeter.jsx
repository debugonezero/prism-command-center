import React from 'react';

// A simple component to render a single "Nixie" digit
const NixieDigit = ({ digit }) => {
  const digitStyle = {
    fontFamily: '"Courier New", Courier, monospace',
    fontWeight: 'bold',
    fontSize: '2.5em',
    color: '#ff8c00', // A deep, glowing orange
    textShadow: '0 0 5px #ff8c00, 0 0 10px #ff8c00, 0 0 15px #ff4500',
    margin: '0 2px',
  };
  return <span style={digitStyle}>{digit}</span>;
};

function DivergenceMeter({ divergenceNumber }) {
  const meterStyle = {
    backgroundColor: '#1a1a1a',
    border: '2px solid #333',
    borderRadius: '10px',
    padding: '10px 20px',
    marginBottom: '20px',
    boxShadow: 'inset 0 0 10px #000',
  };

  return (
    <div style={meterStyle}>
      {divergenceNumber.toString().split('').map((char, index) => (
        <NixieDigit key={index} digit={char} />
      ))}
    </div>
  );
}

export default DivergenceMeter;
