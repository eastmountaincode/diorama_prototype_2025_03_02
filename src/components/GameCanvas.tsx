import React, { useEffect, useState } from 'react';
import SceneManager from '../logic/SceneManager';
import ZoomControls from './ZoomControls';
import CameraController from '../logic/CameraController';
import { useAtom, useAtomValue } from 'jotai';
import { announcementAtom, cameraPositionAtom, currentSceneAtom } from '../atoms/gameState';
import { sceneConfig } from '../scenes/sceneConfig';
import Character from './Character';
import Joystick from './Joystick';
import LifeProgressBar from './LifeProgressBar';
import Consequences from '../logic/Consequences';

// UI Background wrapper component
const UIBackground: React.FC<{
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}> = ({ children, className = "", style = {} }) => {
    return (
        <div 
            className={`bg-slate-700/30 backdrop-blur-sm rounded-lg border border-slate-500/20 ${className}`}
            style={style}
        >
            {children}
        </div>
    );
};

// CSS for the announcement animation
const announcementStyles = `
@keyframes announcement-bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}
`;

const GameCanvas: React.FC = () => {
    const cameraPos = useAtomValue(cameraPositionAtom);
    const [currentScene, _] = useAtom(currentSceneAtom);
    const [sceneHasCharacter, setSceneHasCharacter] = useState(false);
    const [announcement] = useAtom(announcementAtom);

    useEffect(() => {
        setSceneHasCharacter(sceneConfig[currentScene]?.hasCharacter || false);
    }, [currentScene]);

    // Handle game restart or other actions when time runs out
    const handleTimeUp = () => {
        // The actual consequences are now handled by the Consequences component
        console.log('Time is up! Consequences component will handle it.');
    };

    return (
        <div
            className="w-full h-full relative game-canvas overflow-hidden select-none"
            style={{
                '--camera-x': `${cameraPos.x}px`,
                '--camera-y': `${cameraPos.y}px`,
            } as React.CSSProperties}
        >
            {/* Inject CSS for animations */}
            <style>{announcementStyles}</style>
            
            {/* Include Consequences component */}
            <Consequences />
            
            {/* Life Progress Bar with background */}
            <div className="absolute top-5 left-5 z-50">
                <UIBackground className="p-3">
                    <LifeProgressBar onTimeUp={handleTimeUp} />
                </UIBackground>
            </div>

            {/* Scaling Container - Ensures SceneManager scales from the center */}
            <div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                style={{
                    transform: `scale(${cameraPos.zoom})`,
                    transformOrigin: 'center',
                    transition: 'transform 0.1s ease-out',
                    width: '200%',
                    height: '200%',
                    overflow: 'visible',
                }}
            >
                <CameraController>
                    <SceneManager />
                </CameraController>
            </div>

            {/* Character Icon */}
            {sceneHasCharacter && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <Character />
                </div>
            )}

            {/* Zoom Controls with background */}
            <div className="absolute top-5 right-5 z-50">
                <UIBackground className="p-3">
                    <ZoomControls />
                </UIBackground>
            </div>

            {/* Joystick with background */}
            <div className="absolute bottom-5 right-5 z-50">
                <UIBackground className="p-3 flex items-center justify-center" style={{ width: '140px', height: '140px' }}>
                    <div className="w-full h-full flex items-center justify-center">
                        <Joystick />
                    </div>
                </UIBackground>
            </div>

            {/* Full-screen Announcement */}
            {announcement.show && (
                <div className="absolute inset-0 flex items-center justify-center z-100 bg-black/70">
                    <div style={{ animation: 'announcement-bounce 1.5s infinite' }}>
                        <img 
                            src={`assets/announcements/${announcement.type === 'timeUp' ? 'bad.png' : 'info.png'}`}
                            alt={announcement.message || "Announcement"} 
                            className="max-w-full max-h-full object-contain"
                            style={{ maxHeight: '80vh' }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default GameCanvas;
