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
import { SimulationInput } from "src/app/models/views/simulation.input";

@Component({
  selector: "app-analyse",
  templateUrl: "./analyse.component.html",
  styleUrls: ["./analyse.component.scss"],
})
export class AnalyseComponent {
  createNewSimulationDialog: boolean = false;
  paused = true;
  items: MenuItem[];
  simulations: { input: any; simuation: BackgroundSimulation }[] = [];

  backgroundsimulationForm = new FormGroup({
    numberOfCitizens: new FormControl(25),
    contaminatedRatioMin: new FormControl(0),
    contaminatedRatioMax: new FormControl(1),
    contaminationRatioMin: new FormControl(0),
    contaminationRatioMax: new FormControl(1),
    maskRatioMin: new FormControl(0),
    maskRatioMax: new FormControl(1),
  });

  get numberOfCitizens(): FormControl {
    return <FormControl>this.backgroundsimulationForm.get("numberOfCitizens");
  }
  get contaminatedRatioMin(): FormControl {
    return <FormControl>(
      this.backgroundsimulationForm.get("contaminatedRatioMin")
    );
  }
  get contaminatedRatioMax(): FormControl {
    return <FormControl>(
      this.backgroundsimulationForm.get("contaminatedRatioMax")
    );
  }
  get contaminationRatioMin(): FormControl {
    return <FormControl>(
      this.backgroundsimulationForm.get("contaminationRatioMin")
    );
  }
  get contaminationRatioMax(): FormControl {
    return <FormControl>(
      this.backgroundsimulationForm.get("contaminationRatioMax")
    );
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
  createTest() {
    this.createNewSimulationDialog = false;
    for (
      let i = this.contaminatedRatioMin.value * 100;
      i < this.contaminatedRatioMax.value * 100;
      i += 10
    ) {
      for (
        let j = this.contaminationRatioMin.value * 100;
        j < this.contaminationRatioMax.value * 100;
        j += 10
      ) {
        for (
          let k = this.maskRatioMin.value * 100;
          k < this.maskRatioMax.value * 100;
          k += 10
        ) {
          let simulationInput: SimulationInput = {
            contaminatedRatio: i / 100,
            contaminationRatio: j / 100,
            maskRatio: k / 100,
            numberOfCitizens: this.numberOfCitizens.value,
          };

          this.createNewSimulation(simulationInput);
        }
      }
    }

    console.log(this.simulations);
  }

  async createNewSimulation(simulationInput: SimulationInput) {
    this.createNewSimulationDialog = false;
    this.simulations.push({
      input: simulationInput,
      simuation: this.simulatorService.createBackgroundSimulation(
        simulationInput
      ),
    });
  }

  pause() {
    if (!this.paused) {
      this.paused = true;
    }
  }

  play() {
    if (this.paused) {
      this.paused = false;
    }
  }
}
