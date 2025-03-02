import React, { useState, useEffect } from 'react';

interface StartGameModalProps {
  onStartGame: () => void;
}

const StartGameModal_01: React.FC<StartGameModalProps> = ({ onStartGame }) => {
  // State to track which keys are currently pressed
  const [pressedKeys, setPressedKeys] = useState<Record<string, boolean>>({
    w: false,
    a: false,
    s: false,
    d: false
  });

  // Add event listeners for key presses
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (['w', 'a', 's', 'd'].includes(key)) {
        setPressedKeys(prev => ({ ...prev, [key]: true }));
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (['w', 'a', 's', 'd'].includes(key)) {
        setPressedKeys(prev => ({ ...prev, [key]: false }));
      }
    };

    // Add event listeners
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Cleanup event listeners
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Generate class name based on key state
  const getKeyClass = (key: string) => {
    return pressedKeys[key] 
      ? "text-black bg-cyan-400 rounded p-1 text-center font-mono font-bold shadow-glow transition-colors duration-150"
      : "text-white bg-gray-700 rounded p-1 text-center font-mono transition-colors duration-150";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg max-w-md w-full border-2 border-blue-400">
        <pre className="text-green-400 font-mono text-center text-xs sm:text-sm mb-4 leading-tight">
{`
  _____  _                                     
 |  __ \\(_)                                    
 | |  | |_  ___  _ __ __ _ _ __ ___   __ _     
 | |  | | |/ _ \\| '__/ _\` | '_ \` _ \\ / _\` |    
 | |__| | | (_) | | | (_| | | | | | | (_| |    
 |_____/|_|\\___/|_|  \\__,_|_| |_| |_|\\__,_|    
                                               
                                               
`}
        </pre>
        
        <p className="text-cyan-300 text-center mb-4 font-mono">
          &gt; SYSTEM: INITIALIZING INTERACTIVE ENVIRONMENT...
        </p>

        {/* WASD Movement Instructions */}
        <div className="bg-gray-800 p-3 rounded-md mb-5 border border-gray-700">
          <p className="text-yellow-300 text-center font-mono text-sm mb-2">
            &gt; MOVEMENT CONTROLS ACTIVATED:
          </p>
          <div className="grid grid-cols-3 gap-1 max-w-[180px] mx-auto mb-2">
            <div className="text-center"></div>
            <div className={getKeyClass('w')}>W</div>
            <div className="text-center"></div>
            <div className={getKeyClass('a')}>A</div>
            <div className={getKeyClass('s')}>S</div>
            <div className={getKeyClass('d')}>D</div>
          </div>
          <p className="text-green-200 text-center font-mono text-xs">
            &gt; USE WASD KEYS TO NAVIGATE THE ENVIRONMENT
          </p>
          <p className="text-blue-300 text-center font-mono text-xs mt-1">
            &gt; TRY PRESSING THE KEYS NOW TO TEST
          </p>
        </div>

        <div className="flex justify-center">
          <button
            onClick={onStartGame}
            className="bg-blue-600 hover:bg-blue-700 text-white font-mono py-3 px-8 rounded-lg transition-colors duration-200 cursor-pointer border border-blue-400 hover:border-blue-300 transform"
          >
            &gt;&gt; LAUNCH SEQUENCE &lt;&lt;
          </button>
        </div>
        
        <p className="text-gray-500 text-center mt-4 text-xs font-mono">
          [C:\] v1.0.2 // MEMORY LOADED // AWAITING INPUT...
        </p>
      </div>
    </div>
  );
};

// Add this CSS to your global stylesheet if you want a glow effect on key press
// .shadow-glow {
//   box-shadow: 0 0 10px rgba(34, 211, 238, 0.7);
// }

export default StartGameModal_01;