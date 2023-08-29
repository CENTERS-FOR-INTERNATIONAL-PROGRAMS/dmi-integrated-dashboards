import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EnrolmentComponent } from './enrolment.component';

const routes: Routes = [
  {
    path: '',
    component: EnrolmentComponent,
    data: {
      title: `Enrolment`
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EnrolmentRoutingModule {
}
