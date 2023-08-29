import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ScreeningComponent } from './screening.component';

const routes: Routes = [
  {
    path: '',
    component: ScreeningComponent,
    data: {
      title: `Screening`
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScreeningRoutingModule {
}
