import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  AfterViewChecked,
} from "@angular/core";
import { FormBuilder, FormGroup, FormControl } from "@angular/forms";
import { MenuItem } from "primeng";
import { SimulatorService } from "src/app/services/simulator.service";
import { Simulation } from "src/app/models/simulation.model";
import { CsvService } from "src/app/services/csv.service";
import { BackgroundSimulation } from "src/app/models/background-simulation.model";
import { SimulationInput } from "src/app/models/views/simulation.input";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";

@Component({
  selector: "app-analyse",
  templateUrl: "./analyse.component.html",
  styleUrls: ["./analyse.component.scss"],
})
export class AnalyseComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  createNewSimulationDialog: boolean = false;
  items: MenuItem[];
  simulations: {
    id: number;
    input: any;
    simulation: BackgroundSimulation;
  }[] = [];
  result = [];
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

  displayedColumns: string[] = [
    "no",
    "numberOfCitizens",
    "contaminatedRatio",
    "contaminationdRatio",
    "maskRatio",
    "progress",
    "status",
  ];
  dataSource = new MatTableDataSource();

  constructor(
    private readonly simulatorService: SimulatorService,
    private readonly csvService: CsvService,
    private fb: FormBuilder
  ) {}
  ngOnInit() {
    this.dataSource.paginator = this.paginator;
  }
  showNewSimulationPopup() {
    this.createNewSimulationDialog = true;
  }
  createTest() {
    this.createNewSimulationDialog = false;
    for (
      let i =
        this.backgroundsimulationForm.controls.contaminatedRatioMin.value * 100;
      i <
      this.backgroundsimulationForm.controls.contaminatedRatioMax.value * 100;
      i +=
        this.backgroundsimulationForm.controls.contaminatedRatioStep.value * 100
    ) {
      for (
        let j =
          this.backgroundsimulationForm.controls.contaminationRatioMin.value *
          100;
        j <
        this.backgroundsimulationForm.controls.contaminationRatioMax.value *
          100;
        j +=
          this.backgroundsimulationForm.controls.contaminationRatioStep.value *
          100
      ) {
        for (
          let k =
            this.backgroundsimulationForm.controls.maskRatioMin.value * 100;
          k < this.backgroundsimulationForm.controls.maskRatioMax.value * 100;
          k += this.backgroundsimulationForm.controls.maskRatioStep.value * 100
        ) {
          let simulationInput: SimulationInput = {
            contaminatedRatio: i / 100,
            contaminationRatio: j / 100,
            maskRatio: k / 100,
            numberOfCitizens: this.backgroundsimulationForm.controls
              .numberOfCitizens.value,
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
      id: this.simulations.length,
      input: simulationInput,
      simulation: this.simulatorService.createBackgroundSimulation(
        simulationInput
      ),
    });
    this.dataSource.data = this.simulations;
    this.dataSource.paginator = this.paginator;
  }
  getAllgenerations(index) {
    let contaminations = this.simulations[index].simulation.getContaminations();
    if (contaminations.length > 0)
      console.log("contaminations", contaminations);
  }
  downloadResult(index) {
    this.getAllgenerations(index);
  }

   pause(index) {
    if (this.simulations[index].simulation.status !== "paused") {
      this.simulations[index].simulation.pause();
    }
    console.log(index)
  }
  async start(index){
    await new Promise((resolve) => setTimeout(resolve, 300));
    if(index<this.simulations.length)
    this.play(index)
    return true
  }
  play(index) {
    if (this.simulations[index].simulation.status == "paused") {
      this.simulations[index].simulation.play();
    }
    console.log(index)
  }
}
