import React from 'react';
import { useAtom } from 'jotai';
import { zoomLevelAtom } from '../atoms/gameState';

const SceneOne: React.FC = () => {
    const [zoom] = useAtom(zoomLevelAtom);

    return (
        // using h-full keeps the image centered, that's good
        <div className="h-full overflow-hidden flex items-center justify-center">
            <div
                style={{
                    width: `${957 * zoom}px`,
                    height: `${951 * zoom}px`,
                    flexShrink: 0
                }}
            >
                <img
                    src="assets/bg/beach_bg.png"
                    alt="Scene One BG"
                    width={957}
                    height={951}
                    style={{
                        width: '100%',
                        height: '100%',
                        userSelect: 'none',
                        pointerEvents: 'none',
                    }}
                />
            </div>
        </div>
    );
};

export default SceneOne;
