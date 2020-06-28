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

@Component({
  selector: "app-simulator",
  templateUrl: "./simulator.component.html",
  styleUrls: ["./simulator.component.scss"],
})
export class SimulatorComponent
  implements OnInit, AfterViewInit, AfterViewChecked {
  @ViewChild("screen") view: ElementRef;

  createNewSimulationDialog: boolean = false;
  paused = true;
  items: MenuItem[];
  simulation: Simulation;
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

  ngAfterViewChecked() {}

  ngAfterViewInit() {
    this.simulatorService.setup(this.view);
  }

  ngOnInit() {}

  showNewSimulationPopup() {
    this.createNewSimulationDialog = true;
  }

  createNewSimulation() {
    let input = this.simulationForm.value;
    this.createNewSimulationDialog = false;
    this.simulation = this.simulatorService.createSimulation(input);
    this.paused = true;
    this.simulation.show();
  }

  pause() {
    if (!this.paused && this.simulation) {
      this.simulation.stop();
      this.paused = true;
    }
  }

  play() {
    if (this.paused && this.simulation) {
      this.simulation.play();
      this.paused = false;
    }
  }

  speedUp() {
    this.simulation.speedUp();
    this.paused = false;
  }

  speedDown() {
    this.simulation.speedDown();
    this.paused = false;
  }

  download() {
    this.downloadContaminations();
    this.downloadContacts();
  }

  downloadContacts() {
    let contacts = this.simulation.getContacts();
    if (contacts.length > 0)
      this.csvService.downloadFile(
        contacts,
        Object.keys(contacts[0]),
        "contacts_" + new Date().toISOString()
      );
  }

  downloadContaminations() {
    let contaminations = this.simulation.getContaminations();
    if (contaminations.length > 0)
      this.csvService.downloadFile(
        contaminations,
        Object.keys(contaminations[0]),
        "contaminations_" + new Date().toISOString()
      );
  }
}
