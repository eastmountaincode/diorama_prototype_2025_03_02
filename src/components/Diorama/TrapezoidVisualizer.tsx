import React from 'react';
import { TrapezoidBoundaries } from '../../types/boundaries';

interface TrapezoidVisualizerProps {
  trapezoid: TrapezoidBoundaries;
}

const TrapezoidVisualizer: React.FC<TrapezoidVisualizerProps> = ({ trapezoid }) => {
  return (
    <svg className="absolute top-0 left-0 w-full h-full">
      <polygon 
        points={`
          ${trapezoid.topLeft.x},${trapezoid.topLeft.y} 
          ${trapezoid.topRight.x},${trapezoid.topRight.y} 
          ${trapezoid.bottomRight.x},${trapezoid.bottomRight.y} 
          ${trapezoid.bottomLeft.x},${trapezoid.bottomLeft.y}
        `}
        className="fill-green-200 fill-opacity-20 stroke-green-500 stroke-2"
      />
    </svg>
  );
};

export default TrapezoidVisualizer;