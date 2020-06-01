import { NgModule } from "@angular/core";
import {
  ButtonModule,
  DialogModule,
  MenuModule,
  MenubarModule,
  CardModule,
} from "primeng";
@NgModule({
  exports: [MenuModule, MenubarModule, CardModule, DialogModule, ButtonModule],
})
export class NgPrimeModule {}
