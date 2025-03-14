import React, { useState, useEffect } from 'react';

interface AnimatedObjectSpriteProps {
    src: string;
    frameWidth: number;
    frameHeight: number;
    frameCount: number;
    frameRate: number; // frames per second
    scale?: number;
    position: {
        x: number;
        y: number;
    };
    sceneScaleFactor?: number;
}

const AnimatedObjectSprite: React.FC<AnimatedObjectSpriteProps> = ({
    src,
    frameWidth,
    frameHeight,
    frameCount,
    frameRate,
    scale = 1,
    position,
    sceneScaleFactor = 1
}) => {
    const [currentFrame, setCurrentFrame] = useState(0);
    
    // Animation effect
    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentFrame(prevFrame => (prevFrame + 1) % frameCount);
        }, 1000 / frameRate);
        
        return () => clearInterval(intervalId);
    }, [frameCount, frameRate]);
    
    // Calculate the scaled dimensions and position
    const finalScale = scale * sceneScaleFactor;
    const scaledWidth = frameWidth * finalScale;
    const scaledHeight = frameHeight * finalScale;
    const scaledX = position.x * sceneScaleFactor;
    const scaledY = position.y * sceneScaleFactor;
    
    // For a horizontal sprite sheet, we need to create a clipping mask
    // that only shows the current frame
    return (
        <div
            className="absolute pointer-events-none overflow-hidden"
            style={{
                width: `${scaledWidth}px`,
                height: `${scaledHeight}px`,
                left: `${scaledX}px`,
                top: `${scaledY}px`,
                transform: 'translate(-50%, -50%)', // Center the sprite at the position point
            }}
        >
            <div
                style={{
                    width: `${frameWidth * frameCount * finalScale}px`,
                    height: `${scaledHeight}px`,
                    backgroundImage: `url(${src})`,
                    backgroundSize: `${frameWidth * frameCount * finalScale}px ${scaledHeight}px`,
                    transform: `translateX(-${currentFrame * scaledWidth}px)`,
                    imageRendering: 'pixelated', // Optional: for pixel art sprites
                }}
            />
        </div>
    );
};

export default AnimatedObjectSprite; 