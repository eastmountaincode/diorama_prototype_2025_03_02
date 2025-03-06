import React from 'react';
import { useAtom } from 'jotai';
import { currentSceneAtom } from '../atoms/gameState';

const DebugBar: React.FC = () => {
    const [currentScene, setCurrentScene] = useAtom(currentSceneAtom);

    return (
        <div className="h-10 bg-gray-700 text-white flex items-center text-xs px-4 gap-4">
            <span>Scene: {currentScene}</span>

            <div className="flex gap-4">
                {['scene1', 'scene2'].map((scene) => (
                    <button 
                        key={scene} 
                        className="bg-gray-400 px-2 py-1 rounded"
                        onClick={() => setCurrentScene(scene as 'scene1' | 'scene2')}
                    >
                        {scene}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default DebugBar;
