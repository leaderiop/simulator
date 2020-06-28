import { Screen } from "./screen.model";
import { Citizen } from "./citizen.model";
import { Quadtree } from "./quadtree.model";
import { ContactView } from "./views/contact.view";
import { NeighborsView } from "./views/neighbors.view";
import { ContaminationView } from "./views/contamination.view";
export class Simulation {
  private citizens: Citizen[] = [];
  private frame = 0;
  private framesPerSec = 100;
  private player;
  private contacts: ContactView[] = [];
  private contaminations: ContaminationView[] = [];
  constructor(private readonly screen: Screen) {}

  createPopulation(input) {
    this.stop();
    this.player = undefined;
    this.contacts = [];
    this.contaminations = [];
    this.screen.clear();
    let { x, y } = this.screen.getDimension();
    console.log(input);
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
  private showFrame() {
    this.screen.clear();
    let { x, y } = this.screen.getDimension();

    let quadtree = new Quadtree(x / 2, y / 2, x / 2, y / 2);

    this.citizens.forEach((citizen) => {
      quadtree.add(citizen);
    });
    quadtree.draw(this.screen);
    this.citizens.map((citizen) => citizen.move());

    let input = this.citizens.map((citizen) => citizen.getLog());

    let neighbors = this.citizens.map((citizen) =>
      citizen.getNeighbors(quadtree)
    );

    this.contaminations = [
      ...this.contaminations,
      ...this.contaminate(neighbors),
    ];
    this.contacts = [...this.contacts, ...this.getFrameContacts(neighbors)];
    neighbors.forEach((n) => {
      if (n.citizen.isContaminated()) {
        let color: "success" | "danger" = "success";
        if (n.neighbors.length > 0) color = "danger";
        this.screen.drawCercle(n.citizen.position, 40, color);
      }
    });
    this.screen.show(input);
    this.frame++;
  }
  show() {
    this.showFrame();
  }

  private getContaminated() {
    return this.citizens.filter((citizen) => citizen.isContaminated());
  }

  play() {
    this.showFrame();
    this.player = setInterval(() => this.showFrame(), this.framesPerSec);
  }

  stop() {
    clearInterval(this.player);
  }

  speedUp() {
    this.stop();
    this.framesPerSec /= 2;
    this.play();
  }

  speedDown() {
    this.stop();
    this.framesPerSec *= 2;
    this.play();
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
          frame: this.frame,
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
  getContacts() {
    return this.contacts;
  }
  getContaminations() {
    return this.contaminations;
  }
}
