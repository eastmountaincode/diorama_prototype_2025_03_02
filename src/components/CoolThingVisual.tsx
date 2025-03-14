import React from 'react';

// Cool thing configuration (GIF) - position is now relative to the center of the scene
const COOL_THING = {
    src: 'assets/objects/cool_thing.gif',
    width: 150, // Adjust based on actual image size
    height: 150, // Adjust based on actual image size
    position: {
        x: 1025, // Position relative to center (positive = right, negative = left)
        y: 600, // Position relative to center (positive = down, negative = up)
    }
};

interface CoolThingVisualProps {
    scaleFactor: number;
    centerToCornerX: number;
    centerToCornerY: number;
}

const CoolThingVisual: React.FC<CoolThingVisualProps> = ({ scaleFactor, centerToCornerX, centerToCornerY }) => {
    // Calculate absolute position for cool thing (relative to top-left)
    const coolThingAbsoluteX = centerToCornerX + COOL_THING.position.x;
    const coolThingAbsoluteY = centerToCornerY + COOL_THING.position.y;

    return (
        <div
            className="absolute pointer-events-none"
            style={{
                width: `${COOL_THING.width * scaleFactor}px`,
                height: `${COOL_THING.height * scaleFactor}px`,
                left: `${coolThingAbsoluteX * scaleFactor}px`,
                top: `${coolThingAbsoluteY * scaleFactor}px`,
                transform: 'translate(-50%, -50%)', // Center the image at the position point
            }}
        >
            <img
                src={COOL_THING.src}
                alt="Cool Thing"
                className="w-full h-full object-contain"
                style={{ userSelect: 'none' }}
            />
        </div>
    );
};

export default CoolThingVisual; 