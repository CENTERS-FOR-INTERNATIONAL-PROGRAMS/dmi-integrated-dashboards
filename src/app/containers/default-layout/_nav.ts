import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'COVID-19 Mortality',
    url: '/mortality_ncov',
    icon: 'fa fa-virus-covid',
    class: 'view-drawer--link',
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
    icon: 'fa fa-temperature-full',
    class: 'view-drawer--link',
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
        name: 'RDT Laboratory Results',
        url: '/afi/rdt_results'
      },
      {
        name: 'TAC PCR Laboratory Results',
        url: '/afi/pcr_results'
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
    icon: 'fa fa-lungs-virus',
    class: 'view-drawer--link',
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
        name: 'Influenza',
        url: '/sari_ili/influenza'
      },
      {
        name: 'SARS-COV-2',
        url: '/sari_ili/sarscov'
      }
    ]
  },
  {
    name: 'Cholera',
    url: '/cholera',
    icon: 'fa fa-bacteria',
    class: 'view-drawer--link',
    children: [
      {
        name: 'About',
        url: '/cholera/about'
      },
      {
        name: 'Overview',
        url: '/cholera/overview'
      }
    ]
  }
];
