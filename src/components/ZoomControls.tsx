import React from 'react';
import { useAtom } from 'jotai';
import { zoomLevelAtom } from '../atoms/gameState';

const ZoomControls: React.FC = () => {
    const [, setZoom] = useAtom(zoomLevelAtom);

    const handleZoomIn = () => setZoom((prev: number) => Math.min(prev + 0.1, 3));
    const handleZoomOut = () => setZoom((prev: number) => Math.max(prev - 0.1, 0.5));

    return (
        <div className="absolute top-2 right-2 z-50 flex flex-row gap-2">
            <button
                className="bg-gray-700 text-white w-8 h-8 rounded flex items-center justify-center shadow"
                onClick={handleZoomIn}
            >
                +
            </button>
            <button
                className="bg-gray-700 text-white w-8 h-8 rounded flex items-center justify-center shadow"
                onClick={handleZoomOut}
            >
                –
            </button>
        </div>
    );
};

export default ZoomControls;
