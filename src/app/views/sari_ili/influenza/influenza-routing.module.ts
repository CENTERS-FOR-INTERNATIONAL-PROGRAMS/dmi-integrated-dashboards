import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { InfluenzaComponent } from './influenza.component';

const routes: Routes = [
  {
    path: '',
    component: InfluenzaComponent,
    data: {
      title: `Influenza`
      // title: $localize`Dashboard`
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InfluenzaRoutingModule {
}
