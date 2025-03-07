import React, { useRef, useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { currentSceneAtom, cameraPositionAtom } from '../atoms/gameState';
import SceneOne from '../scenes/SceneOne';
import SceneTwo from '../scenes/SceneTwo';

interface SceneManagerProps {
    canvasRef: React.RefObject<HTMLDivElement | null>;
}

const SceneManager: React.FC<SceneManagerProps> = ({ canvasRef }) => {
    const sceneManagerRef = useRef<HTMLDivElement | null>(null);
    const [transformOrigin, setTransformOrigin] = useState('center center');
    const [currentScene] = useAtom(currentSceneAtom);
    const [cameraPos] = useAtom(cameraPositionAtom);

    const updateTransformOrigin = () => {
        const canvasRect = canvasRef.current?.getBoundingClientRect();
        const sceneRect = sceneManagerRef.current?.getBoundingClientRect();

        if (canvasRect && sceneRect) {
            const originX = canvasRect.left + canvasRect.width / 2 - sceneRect.left;
            const originY = canvasRect.top + canvasRect.height / 2 - sceneRect.top;
            setTransformOrigin(`${originX}px ${originY}px`);
        }
    };

    useEffect(() => {
        updateTransformOrigin();
        window.addEventListener('resize', updateTransformOrigin);
        return () => window.removeEventListener('resize', updateTransformOrigin);
    }, []);

    useEffect(() => {
        // Only update transformOrigin when zoom changes
        updateTransformOrigin();
        
    }, [cameraPos.zoom]);

    return (
        <div
            ref={sceneManagerRef}
            className=" w-full h-full transition-opacity duration-300 border-4 border-purple-400"
            style={{
                transform: `scale(${cameraPos.zoom})`,
                transformOrigin: transformOrigin,
                transition: 'transform 0.1s ease-out',
            }}
        >
            {currentScene === 'scene1' && <SceneOne />}
            {currentScene === 'scene2' && <SceneTwo />}
        </div>
    );
};

export default SceneManager;
