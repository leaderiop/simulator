import {
  Component,
  OnInit,
  ViewChild,
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
import { element } from 'protractor';

@Component({
  selector: "app-analyse",
  templateUrl: "./analyse.component.html",
  styleUrls: ["./analyse.component.scss"],
})
export class AnalyseComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  count = 0;

  createNewSimulationDialog: boolean = false;
  items: MenuItem[];
  simulations: {
    id: number;
    input: any;
    simulation: BackgroundSimulation;
  }[] = [];
  backgroundsimulationForm = this.fb.group({
    numberOfCitizensMin: [5],
    numberOfCitizensMax: [100],
    numberOfCitizensStep: [10],
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
      let p =
        this.backgroundsimulationForm.controls.numberOfCitizensMin.value ;
      p <=
      this.backgroundsimulationForm.controls.numberOfCitizensMax.value;
      p +=
        this.backgroundsimulationForm.controls.numberOfCitizensStep.value
    ){
    for (
      let i =
        this.backgroundsimulationForm.controls.contaminatedRatioMin.value * 100;
      i <=
      this.backgroundsimulationForm.controls.contaminatedRatioMax.value * 100;
      i +=
        this.backgroundsimulationForm.controls.contaminatedRatioStep.value * 100
    ) {
      for (
        let j =
          this.backgroundsimulationForm.controls.contaminationRatioMin.value *
          100;
        j <=
        this.backgroundsimulationForm.controls.contaminationRatioMax.value *
          100;
        j +=
          this.backgroundsimulationForm.controls.contaminationRatioStep.value *
          100
      ) {
        for (
          let k =
            this.backgroundsimulationForm.controls.maskRatioMin.value * 100;
          k <= this.backgroundsimulationForm.controls.maskRatioMax.value * 100;
          k += this.backgroundsimulationForm.controls.maskRatioStep.value * 100
        ) {
          let simulationInput: SimulationInput = {
            contaminatedRatio: i / 100,
            contaminationRatio: j / 100,
            maskRatio: k / 100,
            numberOfCitizens: p,
          };
          this.createNewSimulation(simulationInput);
        }
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
    this.count = this.simulations.length;
  }
  downloadResults() {
    let results = [];
      this.simulations.forEach((element)=>{
        let contaminations = element.simulation.getContaminations();
        contaminations=contaminations.map
        ((c,index) => {
          let contamination = {
            contaminationId:index,
            inputId:element.id,
            contaminatedId:c.contaminatedId,
            contaminatorId:c.contaminatorId,
            frame:c.frame,
            numberOfCitizens: element.input.numberOfCitizens,
            contaminatedRatio: element.input.contaminatedRatio,
            contaminationRatio: element.input.contaminationRatio,
            maskRatio: element.input.maskRatio,
          };
          return contamination;
        });
        results  =[...results,...contaminations]

      })
      console.log(results);

      this.csvService.downloadFile(
        results,
        Object.keys(results[0]),
        "contaminations_" + new Date().toISOString()
      );

  }
  downloadResult(index) {
    let contaminations = this.simulations[index].simulation.getContaminations();
    let result = {
      id: index,
      numberOfCitizens: this.simulations[index].input.numberOfCitizens,
      contaminatedRatio: this.simulations[index].input.contaminatedRatio,
      contaminationdRatio: this.simulations[index].input.contaminationdRatio,
      maskRatio: this.simulations[index].input.maskRatio,
      contaminations: contaminations,
    };
    console.log(result)
  }
  pause(index) {
    if (this.simulations[index].simulation.status !== "paused") {
      this.simulations[index].simulation.pause();
    }
  }
  start(index) {
    if (this.count > 0) {
      if (index < this.simulations.length) {
        this.play(index);
      }
      this.isNextPage(index);
    }
    return true;
  }
  isNextPage(index) {
    let modulo = index % this.paginator.pageSize;
    if (!modulo && this.paginator.hasNextPage()) {
      setTimeout(() => {
        this.paginator.nextPage();
      }, 0);
    }
  }
  play(index) {
    if (this.simulations[index].simulation.status == "paused") {
      this.simulations[index].simulation.play();
      this.count--;
    }
  }



}
