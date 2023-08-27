import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SARSCOV2Component } from './sarscov.component';

const routes: Routes = [
  {
    path: '',
    component: SARSCOV2Component,
    data: {
      title: `Sarscov`
      // title: $localize`Dashboard`
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SARSCOV2RoutingModule {
}
