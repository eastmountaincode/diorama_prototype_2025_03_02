import React from 'react';
import WalkableArea from './WalkableArea';

const Diorama: React.FC = () => {
  // Define trapezoid for walkable area
  const trapezoid = {
    // Top of trapezoid (narrower part representing distance)
    topLeft: { x: 230, y: 380 },
    topRight: { x: 550, y: 380 },
    
    // Bottom of trapezoid (wider part representing foreground)
    bottomLeft: { x: 150, y: 470 },
    bottomRight: { x: 620, y: 475 }
  };

  return (
    <div className="diorama-container relative w-[800px] max-w-full mx-auto">
      {/* Diorama background image */}
      <img 
        src="/assets/computer_diorama_sketch_1.png" 
        alt="Computer Diorama Sketch" 
        className="w-full h-auto"
      />
      
      {/* WalkableArea containing the Character */}
      <WalkableArea trapezoid={trapezoid} debug={true} />
    </div>
  );
};

export default Diorama;