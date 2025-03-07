import React from 'react';
import { useAtom } from 'jotai';
import { zoomLevelAtom } from '../atoms/gameState';

const SceneTwo: React.FC = () => {
    const [zoom] = useAtom(zoomLevelAtom);

    return (
        <div className="h-full overflow-hidden flex items-center justify-center ">
            <div
                style={{
                    width: `${1500 * zoom}px`,
                    height: `${1283 * zoom}px`,
                    flexShrink: 0,
                }}
            >
                <img
                    src="assets/bg/desert_diorama_t.png"
                    alt="Scene Two BG"
                    width={1500}
                    height={1283}
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

export default SceneTwo;
