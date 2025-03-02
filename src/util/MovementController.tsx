import { TrapezoidBoundaries } from "../types/boundaries";

class MovementController {
  constructor(private trapezoid: TrapezoidBoundaries, private speed: number = 2) {}
  private characterHeight: number = 48;


  calculateStartPosition() {
    // Directly return the desired starting position
    return { x: 390, y: 425 };
  }

  // Check if the bottom center of the character is inside the trapezoid
  isInsideTrapezoid(x: number, y: number): boolean {
    // Use the bottom center point of the character (y + half the height)
    const bottomY = y + (this.characterHeight / 2);
    
    const topY = Math.min(this.trapezoid.topLeft.y, this.trapezoid.topRight.y);
    const bottomY_boundary = Math.max(this.trapezoid.bottomLeft.y, this.trapezoid.bottomRight.y);
    
    if (bottomY < topY || bottomY > bottomY_boundary) return false;
    
    const factor = (bottomY - topY) / (bottomY_boundary - topY);
    
    const leftX = this.trapezoid.topLeft.x + (this.trapezoid.bottomLeft.x - this.trapezoid.topLeft.x) * factor;
    const rightX = this.trapezoid.topRight.x + (this.trapezoid.bottomRight.x - this.trapezoid.topRight.x) * factor;
    
    return x >= leftX && x <= rightX;
  }

  calculateNewPosition(currentPosition: { x: number, y: number }, direction: 'up' | 'down' | 'left' | 'right') {
    const newPos = { ...currentPosition };
    
    switch (direction) {
      case 'up':
        newPos.y = currentPosition.y - this.speed;
        break;
      case 'down':
        newPos.y = currentPosition.y + this.speed;
        break;
      case 'left':
        newPos.x = currentPosition.x - this.speed;
        break;
      case 'right':
        newPos.x = currentPosition.x + this.speed;
        break;
    }
    
    if (this.isInsideTrapezoid(newPos.x, newPos.y)) {
      return newPos;
    }
    
    return currentPosition;
  }
}

export default MovementController;