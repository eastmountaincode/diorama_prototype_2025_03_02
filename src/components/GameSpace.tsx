import React from 'react';
import GameCanvas from './GameCanvas';
import DebugBar from './DebugBar';

const GameSpace: React.FC = () => {
    return (
        <div className="w-full h-screen flex flex-col bg-gray-400">
            
            {/* Thin Header */}
            <div className="w-full h-10 bg-gray-800 text-white flex items-center justify-center text-sm font-bold">
                HEADER
            </div>

            {/* Full-Screen GameCanvas */}
            <div className="flex-1 w-full bg-gray-500 relative overflow-hidden">
                <GameCanvas />
            </div>

            <DebugBar/>

        </div>
    );
};

export default GameSpace;
