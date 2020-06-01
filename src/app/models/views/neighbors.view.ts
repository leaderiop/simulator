import { Citizen } from "../citizen.model";
import { Vector } from "p5";

export interface NeighborsView {
  time: Date;
  citizen: Citizen;
  neighbors: Citizen[];
  position: Vector;
}
