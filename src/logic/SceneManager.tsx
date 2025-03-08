import React from 'react';
import { useAtom } from 'jotai';
import { currentSceneAtom } from '../atoms/gameState';
import SceneOne from '../scenes/SceneOne';
import SceneTwo from '../scenes/SceneTwo';
import SceneThree from '../scenes/SceneThree';

const SceneManager: React.FC = () => {
    const [currentScene] = useAtom(currentSceneAtom);
    return (
        <div className="absolute inset-0 transition-opacity duration-300 scene-manager">
            {currentScene === 'scene1' && <SceneOne />}
            {currentScene === 'scene2' && <SceneTwo />}
            {currentScene === 'scene3' && <SceneThree />}
        </div>
    );
};

export default SceneManager;
