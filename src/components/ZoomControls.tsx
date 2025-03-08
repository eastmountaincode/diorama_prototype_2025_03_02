import React from 'react';
import { useAtom } from 'jotai';
import { cameraPositionAtom } from '../atoms/gameState';

const ZOOM_LEVELS = [0.5, 0.75, 1.0, 1.5];

const ZoomControls: React.FC = () => {
    const [cameraPos, setCameraPos] = useAtom(cameraPositionAtom);
    const { zoom } = cameraPos;

    /** Handles zoom level changes */
    const handleZoomChange = (zoomFactor: number) => {
        setCameraPos(prev => ({ ...prev, zoom: zoomFactor }));
    };

    /** Increases zoom if possible */
    const handleZoomIn = () => {
        const nextIndex = ZOOM_LEVELS.findIndex(level => level > zoom);
        if (nextIndex !== -1) handleZoomChange(ZOOM_LEVELS[nextIndex]);
    };

    /** Decreases zoom if possible */
    const handleZoomOut = () => {
        const prevIndex = ZOOM_LEVELS.findIndex(level => level >= zoom) - 1;
        if (prevIndex >= 0) handleZoomChange(ZOOM_LEVELS[prevIndex]);
    };

    return (
        <div className="absolute top-3 right-3 z-50 flex flex-row gap-3 select-none">
            {/** Zoom Out Button */}
            <button
                className={`w-12 h-12 rounded flex items-center justify-center shadow transition-all duration-200 ease-in-out 
                    ${
                        zoom <= ZOOM_LEVELS[0]
                            ? 'bg-gray-500 text-gray-300 cursor-not-allowed opacity-50 transition-opacity duration-300'
                            : 'bg-gray-700 text-white hover:bg-gray-600 active:scale-95 cursor-pointer'
                    }`}
                onClick={handleZoomOut}
                disabled={zoom <= ZOOM_LEVELS[0]}
            >
                –
            </button>
             {/** Zoom Level Display */}
             <div className="text-white text-sm px-4 py-1 bg-gray-700 rounded shadow-md items-center flex justify-items-center">
                {zoom.toFixed(2)}x
            </div>

            {/** Zoom In Button */}
            <button
                className={`w-12 h-12 rounded flex items-center justify-center shadow transition-all duration-200 ease-in-out 
                    ${
                        zoom >= ZOOM_LEVELS[ZOOM_LEVELS.length - 1]
                            ? 'bg-gray-500 text-gray-300 cursor-not-allowed opacity-50 transition-opacity duration-300'
                            : 'bg-gray-700 text-white hover:bg-gray-600 active:scale-95 cursor-pointer'
                    }`}
                onClick={handleZoomIn}
                disabled={zoom >= ZOOM_LEVELS[ZOOM_LEVELS.length - 1]}
            >
                +
            </button>
        </div>
    );
};

export default ZoomControls;
