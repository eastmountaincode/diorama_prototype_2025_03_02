import React, { useState, useEffect, useRef } from 'react';
import { MovementDirection } from './WalkableArea';

interface CharacterProps {
  position: { x: number, y: number };
  direction: MovementDirection;
  isMoving: boolean;
}

const Character: React.FC<CharacterProps> = ({ position, direction, isMoving }) => {
  const [frame, setFrame] = useState<'long' | 'short'>('long');
  
  // Animation timer
  const animationTimerRef = useRef<number | null>(null);
  
  // Handle animation frames
  useEffect(() => {
    // Clear existing animation
    if (animationTimerRef.current) {
      clearInterval(animationTimerRef.current);
      animationTimerRef.current = null;
    }
    
    // Start animation if moving
    if (isMoving && direction !== 'standing') {
      animationTimerRef.current = setInterval(() => {
        setFrame(current => current === 'long' ? 'short' : 'long');
      }, 200);
    }
    
    return () => {
      if (animationTimerRef.current) {
        clearInterval(animationTimerRef.current);
      }
    };
  }, [isMoving, direction]);
  
  // Get sprite path based on direction and animation frame
  const getSpritePath = () => {
    switch (direction) {
      case 'left':
        return `${import.meta.env.BASE_URL}/assets/little_guy_sprites/walking_left_${frame}_1.png`;
      case 'right':
        return `${import.meta.env.BASE_URL}/assets/little_guy_sprites/walking_right_${frame}_1.png`;
      case 'standing':
      default:
        return `${import.meta.env.BASE_URL}/assets/little_guy_sprites/standing_1.png`;
    }
  };

  return (
    <div 
      className="absolute pointer-events-none"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -50%)',
        width: '32px',
        height: '48px',
      }}
    >
      <img 
        src={getSpritePath()} 
        alt="Character" 
        className="w-full h-full"
        style={{ imageRendering: 'pixelated' }}
      />
      
      {/* Debug info */}
      <div className="absolute -bottom-12 left-0 text-xs bg-black bg-opacity-70 text-white p-1 whitespace-nowrap">
        {direction} - {isMoving ? 'moving' : 'still'}
      </div>
    </div>
  );
};

export default Character;
