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
    <div className="diorama-outer-container overflow-x-auto w-full">
      <div className="diorama-container relative w-[800px] mx-auto" style={{ minWidth: '800px' }}>
        {/* Diorama background image */}
        <img 
          src={`${import.meta.env.BASE_URL}assets/computer_diorama_sketch_1.png`}
          alt="Computer Diorama Sketch" 
          className="w-[800px]" 
          style={{ width: '800px', height: 'auto' }}
        />
        
        {/* WalkableArea containing the Character */}
        <WalkableArea trapezoid={trapezoid} debug={true} />
      </div>
    </div>
  );
};

export default Diorama;