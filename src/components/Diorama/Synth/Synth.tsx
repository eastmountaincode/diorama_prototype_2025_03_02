import React from 'react';
import Piano from './Piano';

interface SynthProps {
  position: { x: number, y: number };
  isPlayerNearby: boolean;
}

const Synth: React.FC<SynthProps> = ({ position, isPlayerNearby }) => {
  return (
    <div
      className="absolute transition-all duration-300 pointer-events-auto"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -50%)',
        width: '80px', // Adjust width as needed
      }}
    >
      <img
        src={`${import.meta.env.BASE_URL}/assets/synth/synth.png`} 
        alt="Synthesizer"
        className="w-full object-contain"
        style={{ imageRendering: 'auto' }}
      />
      
      {/* Popup bubble that appears when player is nearby */}
      {isPlayerNearby && (
        <div className="absolute left-1/2 transform -translate-x-1/2" style={{ top: '-100px' }}>
          {/* Main popup container */}
          <div 
            className="bg-white rounded-lg p-4 shadow-lg text-black"
            style={{ 
              width: '170px',
              minHeight: '80px',
              borderRadius: '10px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
              backgroundColor: 'rgb(255, 255, 255)' // Ensuring fully opaque white
            }}
          >
            {/* Piano component */}
            <Piano />
          </div>
          
          {/* Triangle pointer */}
          <div 
            className="absolute left-1/2 transform -translate-x-1/2"
            style={{
              bottom: '-10px',
              width: '0',
              height: '0',
              borderLeft: '12px solid transparent',
              borderRight: '12px solid transparent',
              borderTop: '12px solid rgb(255, 255, 255)' // Matching the opaque white
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Synth;