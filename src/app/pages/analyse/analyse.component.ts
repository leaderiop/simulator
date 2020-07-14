import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  AfterViewChecked,
} from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { MenuItem } from "primeng";
import { SimulatorService } from "src/app/services/simulator.service";
import { Simulation } from "src/app/models/simulation.model";
import { CsvService } from "src/app/services/csv.service";
import { BackgroundSimulation } from "src/app/models/background-simulation.model";

@Component({
  selector: "app-analyse",
  templateUrl: "./analyse.component.html",
  styleUrls: ["./analyse.component.scss"],
})
export class AnalyseComponent {
  createNewSimulationDialog: boolean = false;
  paused = true;
  items: MenuItem[];
  simulations: BackgroundSimulation[] = [];
  simulationForm = new FormGroup({
    numberOfCitizens: new FormControl(100),
    contaminatedRatio: new FormControl(0.1),
    contaminationRatio: new FormControl(0.01),
    maskRatio: new FormControl(0.01),
  });
  constructor(
    private readonly simulatorService: SimulatorService,
    private readonly csvService: CsvService
  ) {}

  showNewSimulationPopup() {
    this.createNewSimulationDialog = true;
  }

  createNewSimulation() {
    let input = this.simulationForm.value;
    this.createNewSimulationDialog = false;
    let simulation = this.simulatorService.createBackgroundSimulation(input);
    this.simulations.push(simulation);
    simulation.play();
    simulation.setMaxFrames(1000);
    setTimeout(() => {
      simulation.pause();
      console.log(simulation);
    }, 20);
  }
}
