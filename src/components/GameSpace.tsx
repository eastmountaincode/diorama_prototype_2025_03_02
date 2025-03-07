import React from 'react';
import GameCanvas from './GameCanvas';
import DebugBar from './DebugBar';

const GameSpace: React.FC = () => {
    return (
        <div className="w-full h-full flex flex-col bg-gray-400 border-green-500 border-4">
            
            {/* Thin Header */}
            <div className="w-full h-10 bg-gray-800 text-white flex items-center justify-center text-sm font-bold select-none">
                HEADER
            </div>

            {/* Expanding Middle Section */}
            <div className="flex-1 w-full bg-gray-500 relative overflow-hidden">
                <GameCanvas />
            </div>

            <DebugBar />
        </div>
    );
};

export default GameSpace;


