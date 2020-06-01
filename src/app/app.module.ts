import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { SimulatorComponent } from "./pages/simulator/simulator.component";
import { AnalyseComponent } from "./pages/analyse/analyse.component";
import { ScreenComponent } from "./components/screen/screen.component";
import { FlexLayoutModule } from "@angular/flex-layout";
import { ReactiveFormsModule } from "@angular/forms";
import { NgPrimeModule } from "./prime-ng.module";
import { MaterialModule } from "./material.module";
import { CsvService } from "./services/csv.service";
@NgModule({
  declarations: [
    AppComponent,
    SimulatorComponent,
    AnalyseComponent,
    ScreenComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NgPrimeModule,
    FlexLayoutModule,
    MaterialModule,
    ReactiveFormsModule,
  ],
  providers: [CsvService],
  bootstrap: [AppComponent],
})
export class AppModule {}
