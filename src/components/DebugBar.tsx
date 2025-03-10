import React from 'react';
import { useAtom } from 'jotai';
import { currentSceneAtom } from '../atoms/gameState';

const DebugBar: React.FC = () => {
    const [currentScene, setCurrentScene] = useAtom(currentSceneAtom);
    //const [cameraPos] = useAtom(cameraPositionAtom); // ✅ Get camera position

    return (
        <div className="h-10 bg-gray-700 text-white flex items-center text-xs px-4 gap-6 select-none">
            {/* ✅ Display current scene */}
            <span>Scene: {currentScene}</span>

            {/* ✅ Scene Switch Buttons */}
            <div className="flex gap-2">
                {['scene1', 'scene2', 'scene3'].map((scene) => (
                    <button 
                        key={scene} 
                        className="bg-gray-500 px-2 py-1 rounded hover:bg-gray-400 transition"
                        onClick={() => setCurrentScene(scene as 'scene1' | 'scene2' | 'scene3')}
                    >
                        {scene}
                    </button>
                ))}
            </div>

            {/* ✅ Display Camera Position */}
            {/* <span>Camera: X={cameraPos.x.toFixed(2)}, Y={cameraPos.y.toFixed(2)}, Zoom={cameraPos.zoom.toFixed(2)}x</span> */}
        </div>
    );
};

export default DebugBar;
