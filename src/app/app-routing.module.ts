import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SimulatorComponent } from "./pages/simulator/simulator.component";
import { AnalyseComponent } from "./pages/analyse/analyse.component";

const routes: Routes = [
  { path: "", redirectTo: "simulator", pathMatch: "full" },
  { path: "simulator", component: SimulatorComponent },
  { path: "analyse", component: AnalyseComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
