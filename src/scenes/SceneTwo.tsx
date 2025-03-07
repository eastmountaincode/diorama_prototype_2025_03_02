import React from 'react';

const SceneTwo: React.FC = () => {
    return (
        <div className="h-full flex items-center justify-center">
            <img
                src="assets/bg/desert_diorama_t.png"
                alt="Scene Two BG"
                width={1500}
                height={1283}
                style={{
                    minWidth: '1500px', // ✅ Prevent shrinking below natural width
                    minHeight: '1283px', // ✅ Prevent shrinking below natural height
                    userSelect: 'none',
                    pointerEvents: 'none',
                }}
            />
        </div>
    );
};

export default SceneTwo;
