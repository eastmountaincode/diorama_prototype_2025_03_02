import React from 'react';

const SceneOne: React.FC = () => {
    return (
        <div className="h-full flex items-center justify-center">
            <img
                src="assets/bg/beach_bg.png"
                alt="Scene One BG"
                width={957}
                height={951}
                style={{
                    minWidth: '957px', // ✅ Prevent shrinking below natural width
                    minHeight: '951px', // ✅ Prevent shrinking below natural height
                    userSelect: 'none',
                    pointerEvents: 'none',
                }}
            />
        </div>
    );
};

export default SceneOne;
