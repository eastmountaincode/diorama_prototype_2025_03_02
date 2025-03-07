import React from 'react';
import { useAtom } from 'jotai';
import { cameraPositionAtom } from '../atoms/gameState';

const ZOOM_LEVELS = [0.5, 1.0, 1.5]; // ✅ Allowed zoom increments

const ZoomControls: React.FC = () => {
    const [cameraPos, setCameraPos] = useAtom(cameraPositionAtom);
    const { zoom } = cameraPos;

    const handleZoomIn = () => {
        const nextIndex = ZOOM_LEVELS.findIndex((level) => level > zoom);
        if (nextIndex !== -1) {
            setCameraPos(prev => ({
                ...prev,
                zoom: ZOOM_LEVELS[nextIndex] // ✅ Update zoom inside camera position
            }));
        }
    };

    const handleZoomOut = () => {
        const prevIndex = ZOOM_LEVELS.findIndex((level) => level >= zoom) - 1;
        if (prevIndex >= 0) {
            setCameraPos(prev => ({
                ...prev,
                zoom: ZOOM_LEVELS[prevIndex] // ✅ Update zoom inside camera position
            }));
        }
    };

    return (
        <div className="absolute top-3 right-3 z-50 flex flex-row gap-3">
            <button
                className={`w-12 h-12 rounded flex items-center justify-center shadow transition-all
                    ${zoom <= ZOOM_LEVELS[0] 
                        ? 'bg-gray-500 text-gray-300 cursor-not-allowed opacity-50' 
                        : 'bg-gray-700 text-white hover:bg-gray-600 cursor-pointer'}`}
                onClick={handleZoomOut}
                disabled={zoom <= ZOOM_LEVELS[0]}
            >
                –
            </button>
            <button
                className={`w-12 h-12 rounded flex items-center justify-center shadow transition-all
                    ${zoom >= ZOOM_LEVELS[ZOOM_LEVELS.length - 1] 
                        ? 'bg-gray-500 text-gray-300 cursor-not-allowed opacity-50' 
                        : 'bg-gray-700 text-white hover:bg-gray-600 cursor-pointer'}`}
                onClick={handleZoomIn}
                disabled={zoom >= ZOOM_LEVELS[ZOOM_LEVELS.length - 1]}
            >
                +
            </button>
        </div>
    );
};

export default ZoomControls;
