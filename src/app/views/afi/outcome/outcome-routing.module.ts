import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { OutcomeComponent } from './outcome.component';

const routes: Routes = [
  {
    path: '',
    component: OutcomeComponent,
    data: {
      title: `Diagnosis and Outcome`
      // title: $localize`Dashboard`
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AOutcomeRoutingModule {
}
