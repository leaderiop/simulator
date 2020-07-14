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

  backgroundsimulationForm = new FormGroup({
    numberOfCitizens: new FormControl(25),
    contaminatedRatioMin: new FormControl(0),
    contaminatedRatioMax: new FormControl(1),
    contaminationRatioMin: new FormControl(0),
    contaminationRatioMax: new FormControl(1),
    maskRatioMin: new FormControl(0),
    maskRatioMax: new FormControl(1),
  });
  simulationInput = {
    numberOfCitizens: this.numberOfCitizens.value,
    contaminatedRatio: 0.1,
    contaminationRatio: 0.1,
    maskRatio: 0.1,
  };
  get numberOfCitizens(): FormControl {
    return <FormControl>this.backgroundsimulationForm.get("numberOfCitizens");
  }
  get contaminatedRatioMin(): FormControl {
    return <FormControl>this.backgroundsimulationForm.get("contaminatedRatioMin");
  }
  get contaminatedRatioMax(): FormControl {
    return <FormControl>this.backgroundsimulationForm.get("contaminatedRatioMax");
  }
  get contaminationRatioMin(): FormControl {
    return <FormControl>this.backgroundsimulationForm.get("contaminationRatioMin");
  }
  get contaminationRatioMax(): FormControl {
    return <FormControl>this.backgroundsimulationForm.get("contaminationRatioMax");
  }
  get maskRatioMin(): FormControl {
    return <FormControl>this.backgroundsimulationForm.get("maskRatioMin");
  }
  get maskRatioMax(): FormControl {
    return <FormControl>this.backgroundsimulationForm.get("maskRatioMax");
  }
  displayedColumns: string[] = ["no", "input", "progeress", "status"];
  dataSource = this.simulations;

  constructor(
    private readonly simulatorService: SimulatorService,
    private readonly csvService: CsvService
  ) {}

  showNewSimulationPopup() {
    this.createNewSimulationDialog = true;
  }
  runTest() {
    this.createNewSimulationDialog = false;
    for (let i = this.contaminatedRatioMin.value*100; i < this.contaminatedRatioMax.value*100; i+=10) {
      for (let j = this.contaminationRatioMin.value*100; j < this.contaminationRatioMax.value*100; j+=10) {
        for (let k = this.maskRatioMin.value*100; k < this.maskRatioMax.value*100; k +=10) {

          this.simulationInput.contaminatedRatio = i /100;
          this.simulationInput.contaminationRatio = j/100 ;
          this.simulationInput.maskRatio = k/100;
          this.createNewSimulation();
        }
      }
    }
  }

  async createNewSimulation() {
    this.createNewSimulationDialog = false;
    let simulation = this.simulatorService.createBackgroundSimulation(this.simulationInput);
    this.simulations.push(simulation);
    console.log(this.simulations)
    simulation.play();
    simulation.setMaxFrames(30000);
    await new Promise((resolve) => setTimeout(resolve,  1* 60 * 1000));
  }

  pause() {
    if (!this.paused ) {
      this.paused = true;
    }
  }

  play() {
    if (this.paused ) {
      this.paused = false;
    }
  }
}
