import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Intergrated Dashboards',
    title: true
  },
  {
    name: 'Mortality (COVID-19)',
    url: '/mortality_ncov',
    iconComponent: { name: 'cil-chart' },
    children: [
      {
        name: 'About',
        url: '/mortality_ncov/about'
      },
      {
        name: 'Overview',
        url: '/mortality_ncov/overview'
      },
      {
        name: 'Screening',
        url: '/mortality_ncov/screening'
      },
      {
        name: 'Enrolment',
        url: '/mortality_ncov/enrolment'
      },
      {
        name: 'Results',
        url: '/mortality_ncov/results'
      }
    ]
  },
  {
    name: 'AFI',
    url: '/afi',
    iconComponent: { name: 'cil-chart' },
    children: [
      {
        name: 'About',
        url: '/afi/about'
      },
      {
        name: 'Overview',
        url: '/afi/overview'
      },
      {
        name: 'Syndromic Cases',
        url: '/afi/cases'
      },
      {
        name: 'Laboratory Results',
        url: '/afi/results'
      },
      {
        name: 'Diagnosis and Outcome',
        url: '/afi/outcome'
      }
    ]
  },
  {
    name: 'SARI/ILI',
    url: '/sari_ili',
    iconComponent: { name: 'cil-chart' },
    children: [
      {
        name: 'About',
        url: '/sari_ili/about'
      },
      {
        name: 'Overview',
        url: '/sari_ili/overview'
      },
      {
        name: 'Enrolment',
        url: '/sari_ili/enrolment'
      }
    ]
  }
];
