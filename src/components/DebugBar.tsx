import React from 'react';
import { useAtom } from 'jotai';
import { currentSceneAtom } from '../atoms/gameState';

const DebugBar: React.FC = () => {
    const [currentScene, setCurrentScene] = useAtom(currentSceneAtom);
    //const [mousePos] = useAtom(mousePositionAtom);

    return (
        <div className="h-10 bg-gray-700 text-white flex items-center text-xs px-4 gap-4 select-none">
            <span>Scene: {currentScene}</span>

            <div className="flex gap-4">
                {['scene1', 'scene2', 'scene3'].map((scene) => (
                    <button 
                        key={scene} 
                        className="bg-gray-400 px-2 py-1 rounded"
                        onClick={() => setCurrentScene(scene as 'scene1' | 'scene2' | 'scene3')}
                    >
                        {scene}
                    </button>
                ))}
            </div>
            {/* <span>Mouse: X={mousePos.x.toFixed(2)}, Y={mousePos.y.toFixed(2)}</span> */}


        </div>
    );
};

export default DebugBar;
