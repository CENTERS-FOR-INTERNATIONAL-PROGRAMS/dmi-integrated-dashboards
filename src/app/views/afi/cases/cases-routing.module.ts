import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ACasesComponent } from './cases.component';

const routes: Routes = [
  {
    path: '',
    component: ACasesComponent,
    data: {
      title: `Syndromic Cases`
      // title: $localize`Dashboard`
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ACasesRoutingModule {
}
