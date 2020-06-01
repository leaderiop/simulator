import { Injectable, ElementRef } from "@angular/core";
import { Simulation } from "../models/simulation.model";
import { Screen } from "../models/screen.model";
@Injectable({
  providedIn: "root",
})
export class SimulatorService {
  private simulation: Simulation;
  private screen: Screen;
  constructor() {}

  setup(view: ElementRef) {
    this.screen = new Screen(view);
  }
  createSimulation(input) {
    if (!this.simulation) this.simulation = new Simulation(this.screen);
    this.simulation.createPopulation(input);
    return this.simulation;
  }
}
