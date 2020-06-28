import { ElementRef } from "@angular/core";
import * as p5 from "p5";
export class Screen {
  private p: p5;
  private width: number;
  private height: number;
  constructor(private readonly view: ElementRef) {
    new p5((p) => {
      this.p = p;
    }, this.view.nativeElement);
    this.p.setup = () => {
      this.view.nativeElement.style = "overflow: hidden";
      this.width = this.view.nativeElement.offsetWidth;
      this.height = this.view.nativeElement.offsetHeight;
      this.p.createCanvas(this.width, this.height, this.p.WEBGL);
      this.p.translate(-this.width / 2, -this.height / 2, 0);
      this.p.background(0);
    };
  }
  show(arr) {
    arr.forEach((element) => {
      if (element.contaminated) {
        this.p.fill(255, 0, 0);
      } else {
        this.p.fill(0, 255, 0);
      }
      if (element.hasMask) {
        console.log("he has mask");
        this.p.fill(0, 0, 255);
        this.p.stroke(0, 0, 255);
      } else {
        if (element.contaminated) {
          this.p.stroke(255, 0, 0);
        } else {
          this.p.stroke(0, 255, 0);
        }
      }
      this.p.circle(element.position.x, element.position.y, 5);
    });
  }

  getDimension() {
    return {
      x: this.view.nativeElement.offsetWidth,
      y: this.view.nativeElement.offsetHeight,
    };
  }

  drawRect(x: number, y: number, width: number, height: number) {
    this.p.noFill();
    this.p.stroke(255);
    this.p.rectMode(this.p.CENTER);
    this.p.strokeWeight(0.5);
    this.p.rect(x, y, width * 2, height * 2);
    this.p.strokeWeight(1);
  }
  drawCercle(
    position: p5.Vector,
    d: number,
    color: "danger" | "success" = "success"
  ) {
    this.p.stroke("rgb(255,0,0)");
    this.p.strokeWeight(0.1);
    if (color == "success") this.p.fill("rgba(255,165,0,0.2)");
    if (color == "danger") this.p.fill("rgba(255,0,0, 0.2)");
    this.p.circle(position.x, position.y, d);
  }

  clear() {
    this.p.clear();
    this.p.background(10);
  }
}
