import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AResultsComponent } from './results.component';

const routes: Routes = [
  {
    path: '',
    component: AResultsComponent,
    data: {
      title: `RDT Laboratory Results`
      // title: $localize`Dashboard`
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AResultsRoutingModule {
}
