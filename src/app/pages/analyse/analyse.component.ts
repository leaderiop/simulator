import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  AfterViewChecked,
} from "@angular/core";
import {   FormBuilder,FormGroup, FormControl } from "@angular/forms";
import { MenuItem } from "primeng";
import { SimulatorService } from "src/app/services/simulator.service";
import { Simulation } from "src/app/models/simulation.model";
import { CsvService } from "src/app/services/csv.service";
import { BackgroundSimulation } from "src/app/models/background-simulation.model";
import { SimulationInput } from "src/app/models/views/simulation.input";
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: "app-analyse",
  templateUrl: "./analyse.component.html",
  styleUrls: ["./analyse.component.scss"],
})
export class AnalyseComponent {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  createNewSimulationDialog: boolean = false;
  items: MenuItem[];
  simulations: { input: any; simulation: BackgroundSimulation }[] = [];

  backgroundsimulationForm = this.fb.group({
    numberOfCitizens: [25],
    contaminatedRatioMin: [0.1],
    contaminatedRatioMax: [1],
    contaminatedRatioStep: [0.1],
    contaminationRatioMin: [0.1],
    contaminationRatioMax: [1],
    contaminationRatioStep: [0.1],
    maskRatioMin: [0.1],
    maskRatioMax: [1],
    maskRatioStep: [0.1],
  });

  displayedColumns: string[] = ["no", "input", "progeress", "status"];
  dataSource = new MatTableDataSource();

  constructor(
    private readonly simulatorService: SimulatorService,
    private readonly csvService: CsvService,
    private fb: FormBuilder,
  ) {}

  showNewSimulationPopup() {
    this.createNewSimulationDialog = true;
  }
  createTest() {
    this.createNewSimulationDialog = false;
    for (
      let i = this.backgroundsimulationForm.controls.contaminatedRatioMin.value ;
      i < this.backgroundsimulationForm.controls.contaminatedRatioMax.value ;
      i += this.backgroundsimulationForm.controls.contaminatedRatioStep.value
    ) {
      for (
        let j = this.backgroundsimulationForm.controls.contaminationRatioMin.value ;
        j < this.backgroundsimulationForm.controls.contaminationRatioMax.value ;
        j += this.backgroundsimulationForm.controls.contaminationRatioStep.value
      ) {
        for (
          let k = this.backgroundsimulationForm.controls.maskRatioMin.value ;
          k < this.backgroundsimulationForm.controls.maskRatioMax.value ;
          k += this.backgroundsimulationForm.controls.maskRatioStep.value
        ) {
          let simulationInput: SimulationInput = {
            contaminatedRatio: i,
            contaminationRatio: j ,
            maskRatio: k ,
            numberOfCitizens: this.backgroundsimulationForm.controls.numberOfCitizens.value,
          };

          this.createNewSimulation(simulationInput);
        }
      }
    }

    console.log(this.simulations);
  }

   createNewSimulation(simulationInput: SimulationInput) {
    this.createNewSimulationDialog = false;
    this.simulations.push({
      input: simulationInput,
      simulation: this.simulatorService.createBackgroundSimulation(
        simulationInput
      ),
    });
    this.dataSource.data = this.simulations;
  }

  pause(index) {
    if (this.simulations[index].simulation.status!=='paused') {
      this.simulations[index].simulation.pause();
    }
  }

  play(index) {
    if ( this.simulations[index].simulation.status=='paused') {
      this.simulations[index].simulation.play();
    }

  }
}
