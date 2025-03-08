import React from 'react';

const ORIGINAL_WIDTH = 3778;  // Image's natural width
const ORIGINAL_HEIGHT = 3930; // Image's natural height
const SCALE_FACTOR = 0.4; // ✅ Adjust this to control how much smaller it should be

const FIXED_WIDTH = ORIGINAL_WIDTH * SCALE_FACTOR;
const FIXED_HEIGHT = ORIGINAL_HEIGHT * SCALE_FACTOR;

const SceneThree: React.FC = () => (
    <div className="h-full flex items-center justify-center select-none">
        <img
            src="assets/bg/computer_diorama_sketch_1.png"
            alt="Scene Three Background"
            className="pointer-events-none"
            style={{
                width: `${FIXED_WIDTH}px`, // ✅ Fixed width (scaled down)
                height: `${FIXED_HEIGHT}px`, // ✅ Fixed height (scaled down)
                maxWidth: `${FIXED_WIDTH}px`, // ✅ Prevents growing beyond this size
                maxHeight: `${FIXED_HEIGHT}px`, // ✅ Prevents growing beyond this size
                userSelect: 'none',
            }}
        />
    </div>
);

export default SceneThree;
