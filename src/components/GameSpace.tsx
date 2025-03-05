import React from 'react';
import GameWindow from './GameWindow';

const GameSpace: React.FC = () => {
    return (
        <div
            className="
                relative flex flex-col items-center
                 rounded-lg bg-gray-400
                w-[450px] h-[700px] border-2
            "
        >
            {/* Game Window: Fixed-size "screen" */}
            <div className="w-100 h-[420px] m-6 border-2 rounded-md flex items-center justify-center">
                <GameWindow />
            </div>

            {/* Controls Container */}
            <div className="flex w-full justify-between px-12 items-center mt-6">

                {/* D-Pad */}
                <div className="grid grid-cols-3 gap-1">
                    <div></div> {/* Empty space for alignment */}
                    <button className="w-12 h-12 bg-gray-700 text-white rounded-md border-2 border-gray-800">
                        ▲
                    </button>
                    <div></div> {/* Empty space for alignment */}

                    <button className="w-12 h-12 bg-gray-700 text-white rounded-md border-2 border-gray-800">
                        ◀
                    </button>
                    <button className="w-12 h-12 bg-gray-700 text-white rounded-md border-2 border-gray-800">
                        ⬤
                    </button>
                    <button className="w-12 h-12 bg-gray-700 text-white rounded-md border-2 border-gray-800">
                        ▶
                    </button>

                    <div></div> {/* Empty space for alignment */}
                    <button className="w-12 h-12 bg-gray-700 text-white rounded-md border-2 border-gray-800">
                        ▼
                    </button>
                    <div></div> {/* Empty space for alignment */}
                </div>

                {/* A & B Buttons (Diagonal Layout) */}
                <div className="flex flex-col items-center space-y-4 relative">
                    <button className="w-16 h-16 bg-red-600 text-white rounded-full border-2 border-gray-800 shadow-md transform translate-x-4">
                        A
                    </button>
                    <button className="w-16 h-16 bg-red-600 text-white rounded-full border-2 border-gray-800 shadow-md transform -translate-x-4">
                        B
                    </button>
                </div>

            </div>

        </div>
    );
};

export default GameSpace;

