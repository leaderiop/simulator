import { NgModule } from "@angular/core";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatToolbarModule } from "@angular/material/toolbar";
@NgModule({
  exports: [MatInputModule, MatButtonModule, MatIconModule, MatToolbarModule],
})
export class MaterialModule {}
