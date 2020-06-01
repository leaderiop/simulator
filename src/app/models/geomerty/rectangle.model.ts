export class Rectangle {
  constructor(
    public readonly x: number,
    public readonly y: number,
    public readonly width: number,
    public readonly height: number
  ) {}

  contains(point: { x: number; y: number }) {
    if (
      this.x + this.width >= point.x &&
      this.x - this.width <= point.x &&
      this.y + this.height >= point.y &&
      this.y - this.height <= point.y
    )
      return true;
    else false;
  }
}
