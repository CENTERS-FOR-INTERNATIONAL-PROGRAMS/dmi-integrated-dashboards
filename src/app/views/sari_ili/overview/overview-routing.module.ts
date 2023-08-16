import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SIOverviewComponent } from './overview.component';

const routes: Routes = [
  {
    path: '',
    component: SIOverviewComponent,
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
export class SIOverviewRoutingModule {
}
