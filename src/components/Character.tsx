import React, { useState, useEffect } from 'react';
import { useAtomValue } from 'jotai';
import { characterMovingDirectionAtom, cameraPositionAtom } from '../atoms/gameState';

const SPRITE_SHEET_URL = 'assets/spritesheets/fish_sprite.png';
const SPRITE_SIZE = 33;
const ANIMATION_SPEED = 100; // Milliseconds per frame
const SPRITE_OFFSET_X = 0;
const SPRITE_OFFSET_Y = -32;
const FRAME_SPACING = 4; // ✅ Adjust this to increase/decrease the spacing between frames

// ✅ Maps direction to row index (Y position)
const DIRECTION_ROWS: Record<string, number> = {
    idle: 3,
    up: 1,
    upRight: 2,   // ✅ Up-right uses row 2
    right: 3,
    downRight: 4, // ✅ Down-right uses row 4
    down: 5,
    downLeft: 4,  // ✅ Down-left uses row 4 (flipped)
    left: 3,      // Left uses right row but flips horizontally
    upLeft: 2,    // ✅ Up-left uses row 2 (flipped)
};

const DIRECTION_OFFSETS: Record<string, { x: number; y: number }> = {
    idle: { x: 5, y: 2 },
    up: { x: 0, y: 0 },
    upRight: { x: 4, y: 5 },    // ✅ Fine-tuned for up-right
    right: { x: 6, y: 5 },
    downRight: { x: 4, y: 8 },  // ✅ Fine-tuned for down-right
    down: { x: 0, y: 10 },
    downLeft: { x: 4, y: 8 },   // ✅ Mirrors down-right (flipped)
    left: { x: 5, y: 4 },
    upLeft: { x: 4, y: 4 },     // ✅ Mirrors up-right (flipped)
};


const FRAME_COUNTS: Record<string, number> = {
    idle: 1,
    up: 8,
    upRight: 8,   // ✅ Matches up
    right: 8,
    downRight: 6, // ✅ Matches down
    down: 6,
    downLeft: 6,  // ✅ Matches down (flipped)
    left: 8,
    upLeft: 8,    // ✅ Matches up (flipped)
};


const Character: React.FC = () => {
    const characterMovingDirection = useAtomValue(characterMovingDirectionAtom);
    const { zoom } = useAtomValue(cameraPositionAtom);
    const { x: offsetX, y: offsetY } = DIRECTION_OFFSETS[characterMovingDirection] || { x: 0, y: 0 };


    // ✅ Track current animation frame
    const [frameIndex, setFrameIndex] = useState(0);
    const [prevDirection, setPrevDirection] = useState(characterMovingDirection);

    useEffect(() => {
        if (characterMovingDirection !== prevDirection) {
            setFrameIndex(0); // ✅ Reset animation when changing direction
            setPrevDirection(characterMovingDirection);
        }

        if (characterMovingDirection === 'idle') {
            setFrameIndex(0); // ✅ Reset animation when idle
            return;
        }

        const maxFrames = FRAME_COUNTS[characterMovingDirection] || 8; // ✅ Get correct frame count

        const interval = setInterval(() => {
            setFrameIndex(prev => (prev + 1) % maxFrames); // ✅ Loop within correct frame count
        }, ANIMATION_SPEED);

        return () => clearInterval(interval);
    }, [characterMovingDirection, prevDirection]);

    // ✅ Get correct row (Y position in sprite sheet)
    const rowIndex = DIRECTION_ROWS[characterMovingDirection] || 3;
    const isFlipped = ["left", "upLeft", "downLeft"].includes(characterMovingDirection);


    return (
        <div
            className="select-none"
            style={{
                backgroundImage: `url(${SPRITE_SHEET_URL})`,
                backgroundPosition: `
                -${frameIndex * (SPRITE_SIZE + FRAME_SPACING) + SPRITE_OFFSET_X + offsetX}px 
                -${rowIndex * SPRITE_SIZE + SPRITE_OFFSET_Y + offsetY}px
            `,
                width: `${SPRITE_SIZE}px`,
                height: `${SPRITE_SIZE}px`,
                transform: `scale(${zoom}) ${isFlipped ? 'scaleX(-1)' : ''}`,
                transformOrigin: 'center',
            }}
        />
    );
};

export default Character;
