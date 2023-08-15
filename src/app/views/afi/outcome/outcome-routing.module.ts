import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AOutcomeComponent } from './outcome.component';

const routes: Routes = [
  {
    path: '',
    component: AOutcomeComponent,
    data: {
      title: `Laboratory Outcome`
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
