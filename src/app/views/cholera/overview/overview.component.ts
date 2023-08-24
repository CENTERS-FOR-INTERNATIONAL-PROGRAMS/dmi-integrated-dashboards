import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CholeraChart } from '../../../models/cholera/CholeraChart.model';
import { CCParent } from '../../../models/cholera/CCParent.model';

import * as Highcharts from 'highcharts/highstock';
import HC_exporting from 'highcharts/modules/exporting';

@Component({
  templateUrl: 'overview.component.html',
  styleUrls: ['overview.component.scss']
})

export class OverviewComponent implements OnInit {
  //#region Prerequisites
  CompositeCharts: CCParent = {};
  highcharts = Highcharts;
  //#endregion

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadCharts();
  }

  loadCharts() {

    HC_exporting(Highcharts);
  }
}