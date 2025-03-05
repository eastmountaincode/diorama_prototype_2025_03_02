import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import SceneOne from '../scenes/SceneOne';
import SceneTwo from '../scenes/SceneTwo';

const GameWindow: React.FC = () => {
    const currentScene = useSelector((state: RootState) => state.scene.currentScene);

    return (
        <div className="relative border-2 border-gray-800 bg-gray-300">
            {currentScene === 'scene1' && <SceneOne />}
            {currentScene === 'scene2' && <SceneTwo />}
        </div>
    );
};

export default GameWindow;
