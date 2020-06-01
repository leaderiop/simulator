import { Rectangle } from "./geomerty/rectangle.model";
import { Citizen } from "./citizen.model";
import { Screen } from "./screen.model";
import { Vector } from "p5";
export class Quadtree {
  rectangle: Rectangle;
  citizens: Citizen[] = [];
  topLeft: Quadtree;
  topRight: Quadtree;
  buttomLeft: Quadtree;
  buttomRight: Quadtree;
  divided = false;
  constructor(
    private readonly width: number,
    private readonly height: number,
    private readonly x: number,
    private readonly y: number,
    private readonly capacity: number = 4
  ) {
    this.rectangle = new Rectangle(this.x, this.y, this.width, this.height);
  }

  add(citizen: Citizen) {
    let position = citizen.getLog().position;
    if (!this.rectangle.contains(position)) return;
    if (this.citizens.length < this.capacity && !this.divided) {
      this.citizens.push(citizen);
      return true;
    }
    if (!this.divided) {
      this.topLeft = new Quadtree(
        this.width / 2,
        this.height / 2,
        this.x - this.width / 2,
        this.y - this.height / 2,
        this.capacity
      );
      this.topRight = new Quadtree(
        this.width / 2,
        this.height / 2,
        this.x + this.width / 2,
        this.y - this.height / 2,
        this.capacity
      );
      this.buttomLeft = new Quadtree(
        this.width / 2,
        this.height / 2,
        this.x - this.width / 2,
        this.y + this.height / 2,
        this.capacity
      );
      this.buttomRight = new Quadtree(
        this.width / 2,
        this.height / 2,
        this.x + this.width / 2,
        this.y + this.height / 2,
        this.capacity
      );
      this.divided = true;
      this.citizens.forEach((citizen) => {
        this.add(citizen);
      });
      this.citizens = [];
    }

    if (this.topLeft.add(citizen)) return true;
    else if (this.topRight.add(citizen)) return true;
    else if (this.buttomLeft.add(citizen)) return true;
    else if (this.buttomRight.add(citizen)) return true;
  }

  draw(screen: Screen) {
    screen.drawRect(this.x, this.y, this.width, this.height);
    if (this.divided) {
      this.topLeft.draw(screen);
      this.topRight.draw(screen);
      this.buttomLeft.draw(screen);
      this.buttomRight.draw(screen);
    }
  }

  intersect(rect: Rectangle) {
    if (
      this.rectangle.contains({
        x: rect.x - rect.width / 2,
        y: rect.y - rect.height / 2,
      }) ||
      this.rectangle.contains({
        x: rect.x + rect.width / 2,
        y: rect.y - rect.height / 2,
      }) ||
      this.rectangle.contains({
        x: rect.x - rect.width / 2,
        y: rect.y + rect.height / 2,
      }) ||
      this.rectangle.contains({
        x: rect.x + rect.width / 2,
        y: rect.y + rect.height / 2,
      })
    )
      return true;
    else return false;
  }

  query(rect: Rectangle) {
    if (this.intersect(rect)) {
      let arr = this.citizens;
      if (this.divided)
        arr = [
          ...arr,
          ...this.topLeft.query(rect),
          ...this.topRight.query(rect),
          ...this.buttomLeft.query(rect),
          ...this.buttomRight.query(rect),
        ];
      return arr;
    }
    return [];
  }

  neighbors(point: Vector) {
    let rect = new Rectangle(point.x, point.y, 20, 20);
    let arr = this.query(rect);

    arr = arr.filter((citizen) => {
      let x = point.x - citizen.position.x;
      let y = point.y - citizen.position.y;
      let mag = Math.sqrt(x * x + y * y);
      return mag < 20;
    });
    return arr;
  }
}
