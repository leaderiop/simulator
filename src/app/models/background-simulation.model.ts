import { Citizen } from "./citizen.model";
import { Quadtree } from "./quadtree.model";
import { ContactView } from "./views/contact.view";
import { NeighborsView } from "./views/neighbors.view";
import { ContaminationView } from "./views/contamination.view";

export class BackgroundSimulation {
  public input;
  private citizens: Citizen[] = [];
  public currentFrame = 0;
  public numberOfTotalFrames = 30000;
  private contaminations: ContaminationView[] = [];
  public status: "running" | "paused" | "finished"="paused";
  constructor(public readonly dimension: { x: number; y: number }) {}

  isFinished() {
    return this.currentFrame > this.numberOfTotalFrames;
  }
  getDimension() {
    return this.dimension;
  }
  createPopulation(input) {
    this.input = input;
    this.contaminations = [];
    let { x, y } = this.getDimension();
    this.citizens = [...Array(input.numberOfCitizens).keys()].map(
      (id) =>
        new Citizen(x, y, {
          id: id,
          contaminated: Math.random() < input.contaminatedRatio,
          contaminationRatio: input.contaminationRatio,
          hasMask: Math.random() < input.maskRatio,
        })
    );
  }

  public getContaminated() {
    return this.citizens.filter((citizen) => citizen.isContaminated());
  }
  private showFrame() {
    let { x, y } = this.getDimension();

    let quadtree = new Quadtree(x / 2, y / 2, x / 2, y / 2);

    this.citizens.forEach((citizen) => {
      quadtree.add(citizen);
    });
    this.citizens.map((citizen) => citizen.move());
    this.bounce();
    let input = this.citizens.map((citizen) => citizen.getLog());

    let neighbors = this.citizens.map((citizen) =>
      citizen.getNeighbors(quadtree)
    );

    this.contaminations = [
      ...this.contaminations,
      ...this.contaminate(neighbors),
    ];

    this.currentFrame++;
  }

  play() {
    if (this.status != "running") {
      this.status = "running";
      this.loop();
    }
  }
  loop() {
    while (this.status == "running") {
      this.showFrame();
      if (this.isFinished()) {
        this.status = "finished";

        this.pause();
      }
    }
  }


  pause() {
    if (!this.isFinished()) this.status = "paused";
  }

  private contaminate(neighbors: NeighborsView[]): ContaminationView[] {
    return neighbors
      .map((neighbor) => {
        return neighbor.neighbors
          .map((citizen) => {
            if (neighbor.citizen.isContaminated()) {
              return citizen.contaminate(neighbor.citizen);
            }
          })
          .filter((c) => c);
      })
      .filter((arr) => arr.filter((el) => el).length > 0)
      .reduce((acc, tmp) => [...acc, ...tmp], []);
  }
  private getFrameContacts(neighbors: NeighborsView[]): ContactView[] {
    let date = new Date();
    let cont = neighbors.map((record) => {
      let citizen = record.citizen;
      return record.neighbors.map((n) => {
        let x = n.position.x - citizen.position.x;
        let y = n.position.y - citizen.position.y;
        let distance = Math.sqrt(x * x + y * y);
        let contact: ContactView = {
          frame: this.currentFrame,
          citizenGuestId: n.getId(),
          citizenHostId: citizen.getId(),
          time: date,
          distance,
        };
        return contact;
      });
    });

    return cont.reduce((acc, tmp) => [...acc, ...tmp], []);
  }

  getContaminations() {
    return this.contaminations;
  }
  bounce() {
    let { x, y } = this.getDimension();
    this.citizens
      .filter((citizen) => {
        let position = citizen.getLog().position;
        if (
          position.x < 0 ||
          position.y < 0 ||
          position.x > x ||
          position.y > y
        ) {
          return true;
        } else return false;
      })
      .map((citizen) => citizen.bounce());
  }

  setMaxFrames(n: number) {
    this.numberOfTotalFrames = n;
    if (!this.isFinished()) {
      this.status = "paused";
    }
  }
  getMaxFrames(): number {
    return this.numberOfTotalFrames;
  }
}
