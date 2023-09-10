import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { IconSetService } from '@coreui/icons-angular';
import { iconSubset } from './icons/icon-subset';
import { Title } from '@angular/platform-browser';

import * as Highcharts from 'highcharts';
import * as Highstock from 'highcharts/highstock';
import HighchartsExporting from 'highcharts/modules/exporting';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsSolidGauge from 'highcharts/modules/solid-gauge';
import HighchartsGroupedCategories from 'highcharts-grouped-categories';

HighchartsGroupedCategories(Highcharts);
HighchartsMore(Highcharts);
HighchartsSolidGauge(Highcharts);
HighchartsExporting(Highcharts);

HighchartsGroupedCategories(Highstock);
HighchartsMore(Highstock);
HighchartsExporting(Highstock);

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {
  title = 'Intergrated Dashboards';

  constructor(
    private router: Router,
    private titleService: Title,
    private iconSetService: IconSetService
  ) {
    titleService.setTitle(this.title);
    // iconSet singleton
    iconSetService.icons = { ...iconSubset };
  }

  ngOnInit(): void {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
    });
  }
}
