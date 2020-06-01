import { Vector } from "p5";
import { scaleLinear } from "d3-scale";
import { Perlin } from "./perlin.model";
import { Quadtree } from "./quadtree.model";
import { NeighborsView } from "./views/neighbors.view";
import { CitizenView } from "./views/citizen.view";
import { ContaminationView } from "./views/contamination.view";

export class Citizen {
  private id: number;
  speed: Vector = new Vector();
  position: Vector = new Vector();
  contaminated: boolean;
  speed_x_off = Math.floor(Math.random() * 100000);
  speed_y_off = Math.floor(Math.random() * 100000);
  contaminationRatio: number;
  speed_scale = scaleLinear()
    .domain([-0.5, 0.5])
    .range([-2 * Math.random(), 2 * Math.random()]);
  contaminationScaler = scaleLinear().domain([0, 20]).range([10, 1]);
  perlin = new Perlin();
  constructor(
    private readonly width: number,
    private readonly height: number,
    info: CitizenView
  ) {
    this.id = info.id;
    this.contaminated = info.contaminated;
    this.contaminationRatio = info.contaminationRatio
      ? info.contaminationRatio
      : 0.1;
    this.position.set(
      Math.floor(Math.random() * this.width),
      Math.floor(Math.random() * this.height)
    );
  }
  move() {
    this.speed.set(
      this.speed_scale(this.perlin.getValue(this.speed_x_off)),
      this.speed_scale(this.perlin.getValue(this.speed_y_off))
    );
    this.speed_x_off += Math.random() * 0.01;
    this.speed_y_off += Math.random() * 0.01;

    this.position.add(this.speed);
  }
  getLog() {
    return {
      position: this.position,
      contaminated: this.contaminated,
    };
  }
  isContaminated() {
    return this.contaminated;
  }

  getNeighbors(quadtree: Quadtree): NeighborsView {
    return {
      citizen: this,
      neighbors: quadtree
        .neighbors(this.position)
        .filter((c) => this.id != c.id),
      position: this.position,
      time: new Date(),
    };
  }
  contaminate(citizen: Citizen) {
    let x = this.position.x - citizen.position.x;
    let y = this.position.y - citizen.position.y;
    let distance = Math.sqrt(x * x + y * y);
    if (
      !this.contaminated &&
      Math.random() <
        this.contaminationRatio * this.contaminationScaler(distance)
    ) {
      this.contaminated = true;
      let contamination: ContaminationView = {
        contaminatedId: this.id,
        contaminatorId: citizen.getId(),
        time: new Date(),
      };
      return contamination;
    }
  }
  getId() {
    return this.id;
  }
}
