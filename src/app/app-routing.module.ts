import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DefaultLayoutComponent } from './containers';
import { AboutComponent } from './views/mortality_ncov/about/about.component'
import { Page404Component } from './views/pages/page404/page404.component';
import { Page500Component } from './views/pages/page500/page500.component';
import { LoginComponent } from './views/pages/login/login.component';
import { RegisterComponent } from './views/pages/register/register.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'mortality_ncov/about',
    pathMatch: 'full'
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [

      {
        path: 'sari_ili/about',
        loadChildren: () =>
          import('./views/sari_ili/about/about.module').then((m) => m.AboutModule)
      },
      {
        path: 'sari_ili/overview',
        loadChildren: () =>
          import('./views/sari_ili/overview/overview.module').then((m) => m.SIOverviewModule)
      },
      {
        path: 'sari_ili/influenza',
        loadChildren: () =>
          import('./views/sari_ili/influenza/influenza.module').then((m) => m.InfluenzaModule)
      },
      {
        path: 'sari_ili/sarscov',
        loadChildren: () =>
          import('./views/sari_ili/sarscov/sarscov.module').then((m) => m.SARSCOV2Module)
      },
      {
        path: 'cholera/about',
        loadChildren: () =>
          import('./views/cholera/about/about.module').then((m) => m.AboutModule)
      },
      {
        path: 'cholera/overview',
        loadChildren: () =>
          import('./views/cholera/overview/overview.module').then((m) => m.OverviewModule)
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./views/dashboard/dashboard.module').then((m) => m.DashboardModule)
      },
      {
        path: 'pages',
        loadChildren: () =>
          import('./views/pages/pages.module').then((m) => m.PagesModule)
      },
    ]
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'COVID-19 Mortality'
    },
    children: [
      {
        path: 'mortality_ncov/about',
        loadChildren: () =>
          import('./views/mortality_ncov/about/about.module').then((m) => m.AboutModule)
      },
      {
        path: 'mortality_ncov/overview',
        loadChildren: () =>
          import('./views/mortality_ncov/overview/overview.module').then((m) => m.OverviewModule)
      },
      {
        path: 'mortality_ncov/screening',
        loadChildren: () =>
          import('./views/mortality_ncov/screening/screening.module').then((m) => m.ScreeningModule)
      },
      {
        path: 'mortality_ncov/enrolment',
        loadChildren: () =>
          import('./views/mortality_ncov/enrolment/enrolment.module').then((m) => m.EnrolmentModule)
      },
      {
        path: 'mortality_ncov/results',
        loadChildren: () =>
          import('./views/mortality_ncov/results/results.module').then((m) => m.ResultsModule)
      }
    ]
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'AFI'
    },
    children: [
      {
        path: 'afi/about',
        loadChildren: () =>
          import('./views/afi/about/about.module').then((m) => m.AboutModule)
      },
      {
        path: 'afi/overview',
        loadChildren: () =>
          import('./views/afi/overview/overview.module').then((m) => m.AOverviewModule)
      },
      {
        path: 'afi/cases',
        loadChildren: () =>
          import('./views/afi/cases/cases.module').then((m) => m.ACasesModule)
      },
      {
        path: 'afi/rdt_results',
        loadChildren: () =>
          import('./views/afi/results_rdt/results.module').then((m) => m.AResultsModule)
      },
      {
        path: 'afi/pcr_results',
        loadChildren: () =>
          import('./views/afi/results_pcr/results.module').then((m) => m.AResultsModule)
      },
      {
        path: 'afi/outcome',
        loadChildren: () =>
          import('./views/afi/outcome/outcome.module').then((m) => m.AOutcomeModule)
      }
    ]
  },
  {
    path: '404',
    component: Page404Component,
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    component: Page500Component,
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: {
      title: 'Register Page'
    }
  },
  { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top',
      anchorScrolling: 'enabled',
      initialNavigation: 'enabledBlocking'
      // relativeLinkResolution: 'legacy'
    })
  ],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
