import React from 'react';
import { TrapezoidBoundaries } from '../../types/boundaries';

interface DebugPanelProps {
  position: { x: number, y: number };
  trapezoid: TrapezoidBoundaries;
}

const DebugPanel: React.FC<DebugPanelProps> = ({ position, trapezoid }) => {
  return (
    <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white p-2 text-xs font-mono z-50">
      <div>Position: x={position.x.toFixed(1)}, y={position.y.toFixed(1)}</div>
      <div>Trapezoid:</div>
      <div>- TL: ({trapezoid.topLeft.x}, {trapezoid.topLeft.y})</div>
      <div>- TR: ({trapezoid.topRight.x}, {trapezoid.topRight.y})</div>
      <div>- BL: ({trapezoid.bottomLeft.x}, {trapezoid.bottomLeft.y})</div>
      <div>- BR: ({trapezoid.bottomRight.x}, {trapezoid.bottomRight.y})</div>
      
    </div>
  );
};

export default DebugPanel;