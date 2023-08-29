import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AOverviewComponent } from './overview.component';

const routes: Routes = [
  {
    path: '',
    component: AOverviewComponent,
    data: {
      title: `Overview`
      // title: $localize`Dashboard`
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AOverviewRoutingModule {
}
