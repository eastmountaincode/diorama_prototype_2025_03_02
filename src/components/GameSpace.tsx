import React from 'react';
import GameCanvas from './GameCanvas';
import DebugBar from './DebugBar';
import './MarqueeHeader.css';
import MarqueeHeader from './MarqueeHeader';

const GameSpace: React.FC = () => {
    return (
        <div className="w-full h-full flex flex-col bg-gray-400">

            {/* ✅ Header Section */}
            <MarqueeHeader />

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


