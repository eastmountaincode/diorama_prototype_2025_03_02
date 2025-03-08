import React from 'react';
import GameCanvas from './GameCanvas';
import DebugBar from './DebugBar';

const GameSpace: React.FC = () => {
    return (
        <div className="w-full h-full flex flex-col bg-gray-400">
            
            {/* ✅ Header Section */}
            <header className="w-full h-10 bg-gray-800 text-white flex items-center justify-center text-sm font-bold select-none">
                HEADER
            </header>

            {/* ✅ Main Content Area */}
            <main className="flex-1 w-full bg-gray-500 relative overflow-hidden">
                <GameCanvas />
            </main>

            {/* ✅ Debug Bar (Bottom) */}
            <DebugBar />
        </div>
    );
};

export default GameSpace;


