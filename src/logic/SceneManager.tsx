import React, { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { currentSceneAtom } from '../atoms/gameState';
import SceneOne from '../scenes/SceneOne';
import SceneTwo from '../scenes/SceneTwo';

const SceneManager: React.FC = () => {
    const [currentScene] = useAtom(currentSceneAtom);
    const [visibleScene, setVisibleScene] = useState(currentScene);
    const [opacity, setOpacity] = useState(1);

    useEffect(() => {
        setOpacity(0); // start fade-out

        const fadeTimer = setTimeout(() => {
            setVisibleScene(currentScene); // switch scene halfway
            setOpacity(1); // fade back in
        }, 300); // fade-out duration

        return () => clearTimeout(fadeTimer);
    }, [currentScene]);

    return (
        <div
            className="w-full h-full transition-opacity duration-300 border-purple-300 border-4"
            style={{ opacity }}
        >
            {visibleScene === 'scene1' && <SceneOne />}
            {visibleScene === 'scene2' && <SceneTwo />}
        </div>
    );
};

export default SceneManager;
