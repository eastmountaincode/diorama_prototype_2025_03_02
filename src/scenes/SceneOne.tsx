import React from 'react';

const SceneOne: React.FC = () => (
    <div className="h-full flex items-center justify-center select-none">
        <img
            src="assets/bg/beach_bg.png"
            alt="Scene One Background"
            className="pointer-events-none"
            style={{
                minWidth: '957px',
                minHeight: '951px',
                userSelect: 'none',
            }}
        />
    </div>
);

export default SceneOne;
