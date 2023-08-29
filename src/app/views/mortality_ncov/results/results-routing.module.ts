import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ResultsComponent } from './results.component';

const routes: Routes = [
  {
    path: '',
    component: ResultsComponent,
    data: {
      title: `Results`
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResultsRoutingModule {
}
