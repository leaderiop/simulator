import { NgModule } from "@angular/core";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTableModule } from "@angular/material/table";
import {MatProgressBarModule} from '@angular/material/progress-bar';


@NgModule({
  exports: [MatInputModule, MatButtonModule, MatIconModule, MatToolbarModule,MatTableModule,MatProgressBarModule],
})
export class MaterialModule {}
