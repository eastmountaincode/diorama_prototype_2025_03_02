import React, { useState, useEffect } from 'react';
import Character from './Character';
// import TrapezoidVisualizer from './TrapezoidVisualizer';
import DebugPanel from './DebugPanel';
import MovementController from '../../util/MovementController';
import { TrapezoidBoundaries } from '../../types/boundaries';
import Radio from './Radio';

interface WalkableAreaProps {
  trapezoid: TrapezoidBoundaries;
  debug?: boolean;
}

export type MovementDirection = 'left' | 'right' | 'standing';

const WalkableArea: React.FC<WalkableAreaProps> = ({ 
  trapezoid,
  debug = false
}) => {
  const movementController = new MovementController(trapezoid);
  const [position, setPosition] = useState(movementController.calculateStartPosition());

  // Radio position
  const radioPosition = { x: 480, y: 370 }; // Adjust this position as needed

  // Define the maximum distance for radio detection
  const MAX_RADIO_DISTANCE = 350; // Pixels

  // Interaction state
  const [isNearRadio, setIsNearRadio] = useState(false);
  const [radioProximityPercentage, setRadioProximityPercentage] = useState(0);


  // Key states
  const [keys, setKeys] = useState({
    up: false,
    down: false,
    left: false,
    right: false
  });
  
  // Track character direction
  const [direction, setDirection] = useState<MovementDirection>('standing');

  // Check distance to radio
  useEffect(() => {
    const distanceToRadio = Math.sqrt(
      Math.pow(position.x - radioPosition.x, 2) + 
      Math.pow(position.y - radioPosition.y, 2)
    );
    
    // Calculate proximity percentage - closer means higher percentage
    const rawPercentage = 100 - (distanceToRadio / MAX_RADIO_DISTANCE) * 100;
    
    // Clamp between 0-100%
    const clampedPercentage = Math.max(0, Math.min(100, rawPercentage));
    
    setRadioProximityPercentage(Math.round(clampedPercentage));
    
    // Player is near radio if distance is less than 50 pixels
    setIsNearRadio(distanceToRadio < 50);
  }, [position, radioPosition]);

  // Check if player is near the radio
  useEffect(() => {
    const distanceToRadio = Math.sqrt(
      Math.pow(position.x - radioPosition.x, 2) + 
      Math.pow(position.y - radioPosition.y, 2)
    );
    
    // Player is near radio if distance is less than 50 pixels
    setIsNearRadio(distanceToRadio < 50);
  }, [position, radioPosition]);

  // Handle key events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === 'w' || key === 'arrowup') {
        setKeys(prev => ({ ...prev, up: true }));
      } else if (key === 's' || key === 'arrowdown') {
        setKeys(prev => ({ ...prev, down: true }));
      } else if (key === 'a' || key === 'arrowleft') {
        setKeys(prev => ({ ...prev, left: true }));
        setDirection('left');
      } else if (key === 'd' || key === 'arrowright') {
        setKeys(prev => ({ ...prev, right: true }));
        setDirection('right');
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === 'w' || key === 'arrowup') {
        setKeys(prev => ({ ...prev, up: false }));
      } else if (key === 's' || key === 'arrowdown') {
        setKeys(prev => ({ ...prev, down: false }));
      } else if (key === 'a' || key === 'arrowleft') {
        setKeys(prev => ({ ...prev, left: false }));
        // Only set standing if right is not also pressed
        if (!keys.right) setDirection('standing');
      } else if (key === 'd' || key === 'arrowright') {
        setKeys(prev => ({ ...prev, right: false }));
        // Only set standing if left is not also pressed
        if (!keys.left) setDirection('standing');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [keys]);

  // Movement effect - runs when key states change
  useEffect(() => {
    if (!keys.up && !keys.down && !keys.left && !keys.right) {
      setDirection('standing');
      return;
    }

    const moveInterval = setInterval(() => {
      setPosition(currentPos => {
        let newPos = { ...currentPos };
        
        if (keys.up) {
          newPos = movementController.calculateNewPosition(newPos, 'up');
        }
        if (keys.down) {
          newPos = movementController.calculateNewPosition(newPos, 'down');
        }
        if (keys.left) {
          newPos = movementController.calculateNewPosition(newPos, 'left');
          setDirection('left');
        }
        if (keys.right) {
          newPos = movementController.calculateNewPosition(newPos, 'right');
          setDirection('right');
        }
        
        return newPos;
      });
    }, 16); // ~60fps

    return () => clearInterval(moveInterval);
  }, [keys]);

  // Determine if moving for animation purposes
  const isMoving = keys.left || keys.right || keys.up || keys.down;

  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
      {/* <TrapezoidVisualizer trapezoid={trapezoid} /> */}
      {/* Radio element */}
      <Radio 
        position={radioPosition} 
        isPlayerNearby={isNearRadio}
        radioProximityPercentage={radioProximityPercentage}
        debug={debug}
      />
      
      <Character 
        position={position} 
        direction={direction} 
        isMoving={isMoving} 
      />
      
      {debug && (
        <DebugPanel 
          position={position} 
          trapezoid={trapezoid} 
        />
      )}
    </div>
  );
};

export default WalkableArea;