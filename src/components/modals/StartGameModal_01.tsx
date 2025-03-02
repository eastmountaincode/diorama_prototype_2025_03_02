import React from 'react';

interface StartGameModalProps {
  onStartGame: () => void;
}

const StartGameModal_01: React.FC<StartGameModalProps> = ({ onStartGame }) => {
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
        <p className="text-cyan-300 text-center mb-6 font-mono">
          &gt; SYSTEM: INITIALIZING INTERACTIVE ENVIRONMENT...
        </p>
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

export default StartGameModal_01;
