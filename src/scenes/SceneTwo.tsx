import React from 'react';

const SceneTwo: React.FC = () => (
    <div className="h-full flex items-center justify-center select-none">
        <img
            src="assets/bg/desert_diorama_t.png"
            alt="Scene Two Background"
            className="pointer-events-none"
            style={{
                minWidth: '1500px',
                minHeight: '1283px',
                userSelect: 'none',
            }}
        />
    </div>
);

export default SceneTwo;
