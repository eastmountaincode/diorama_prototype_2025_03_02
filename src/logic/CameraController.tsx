import React, { useRef, useEffect } from 'react';
import { useAtom } from 'jotai';
import { cameraPositionAtom, mousePositionAtom } from '../atoms/gameState';

const CameraController: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const isHolding = useRef(false);
    const mousePositionRef = useRef({ x: 0, y: 0 });
    const moveInterval = useRef<number | null>(null);

    const [cameraPos, setCameraPos] = useAtom(cameraPositionAtom);
    const [, setMousePos] = useAtom(mousePositionAtom);

    const updateMousePos = (e: MouseEvent | TouchEvent) => {
        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        let clientX: number, clientY: number;
        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        const x = clientX - centerX;
        const y = clientY - centerY;

        mousePositionRef.current = { x, y };
        setMousePos({x, y})
    };

    const startMoving = () => {
        if (moveInterval.current !== null) clearInterval(moveInterval.current);

        moveInterval.current = window.setInterval(() => {
            const { x, y } = mousePositionRef.current;
            const distance = Math.sqrt(x ** 2 + y ** 2);
            if (distance < 5) return; // Avoid jitter when too close to center

            const normalizedX = x / distance;
            const normalizedY = y / distance;

            const speed = 2.5 * cameraPos.zoom;

            setCameraPos(prev => ({
                x: prev.x - normalizedX * speed,
                y: prev.y - normalizedY * speed,
                zoom: prev.zoom
            }));
        }, 16); // ~60fps
    };

    const stopMoving = () => {
        if (moveInterval.current !== null) {
            clearInterval(moveInterval.current);
            moveInterval.current = null;
        }
    };

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleMouseDown = (e: MouseEvent | TouchEvent) => {
            isHolding.current = true;
            updateMousePos(e);
            startMoving();
        };

        const handleMouseMove = (e: MouseEvent | TouchEvent) => {
            if (isHolding.current) {
                updateMousePos(e);
            }
        };

        const handleMouseUp = () => {
            isHolding.current = false;
            stopMoving();
        };

        container.addEventListener('mousedown', handleMouseDown);
        container.addEventListener('mousemove', handleMouseMove);
        container.addEventListener('touchstart', handleMouseDown);
        container.addEventListener('touchmove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('touchend', handleMouseUp);

        return () => {
            container.removeEventListener('mousedown', handleMouseDown);
            container.removeEventListener('mousemove', handleMouseMove);
            container.removeEventListener('touchstart', handleMouseDown);
            container.removeEventListener('touchmove', handleMouseMove);

            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('touchend', handleMouseUp);

            stopMoving();
        };
    }, [cameraPos.zoom]);

    return (
        <div ref={containerRef} className="w-full h-full relative overflow-hidden border-2 border-red-500">
            {/* Interaction Layer
            <div
                className="absolute inset-0 z-10 pointer-events-auto"
            /> */}

            {/* Scene Layer - Visual Movement */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    transform: `translate(var(--camera-x, 0px), var(--camera-y, 0px))`,
                    transformOrigin: 'center',
                    transition: 'transform 0.016s linear', // Smooth animation
                }}
            >
                {children}
            </div>
        </div>
    );
};

export default CameraController;
