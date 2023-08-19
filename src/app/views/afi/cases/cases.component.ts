import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { AFIProperties } from '../../../models/afi/AFIProperties.model';
import { AFIChart } from '../../../models/afi/AFIChart.model';
import { ACParent } from '../../../models/afi/ACParent.model';

import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsSolidGauge from 'highcharts/modules/solid-gauge';
import { HttpClient } from '@angular/common/http';

HighchartsMore(Highcharts);
HighchartsSolidGauge(Highcharts);

@Component({
  templateUrl: 'cases.component.html',
  styleUrls: ['cases.component.scss']
})

export class ACasesComponent implements OnInit {
  //#region Prerequisites
  CompositeCharts: ACParent = {};
  highcharts = Highcharts;
  //#endregion

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadCharts();
  }

  loadCharts() {
    //#region Load Chart --> Syndromes by Gender
    this.CompositeCharts['syndromesByGender'] = new AFIChart(this.http);
    this.CompositeCharts['syndromesByGender'].loadData(
      "overview/syndromesByGender",
      () => {
        let MCTemp = this.CompositeCharts['syndromesByGender'];

        for (let index = 0; index < 2; index++) {
          MCTemp.ChartSeries.push([]);
          MCTemp.ChartSeries[index].push(Math.floor(Math.random() * 1000));
          MCTemp.ChartSeries[index].push(0);
        }

        MCTemp.LoadChartOptions();
      },
      () => {
        let MCTemp = this.CompositeCharts['syndromesByGender'];
      },
      () => {
        let MCTemp = this.CompositeCharts['syndromesByGender'];

        MCTemp.ChartOptions = {
          title: {
            text: 'Syndromes by Gender',
            align: 'left'
          },
          chart: {
            type: "pie",
          },
          colors: [
            "#234FEA",
            "#FC7500"
          ],
          series: [
            {
              showInLegend: true,
              name: "Data",
              type: 'pie',
              data: [
                ["Male (" + MCTemp.ChartSeries[0][1] + "%)", MCTemp.ChartSeries[0][0]],
                ["Female (" + MCTemp.ChartSeries[1][1] + "%)", MCTemp.ChartSeries[1][0]]
              ]
            }
          ],
          plotOptions: {
            pie: {
              innerSize: "70%",
              depth: 25,
              dataLabels: {
                enabled: false
              },
            }
          },
          credits: {
            enabled: false,
          }
        }
      }
    );
    //#endregion

    //#region Load Chart --> Syndromes by Facility
    this.CompositeCharts['syndromesByFacility'] = new AFIChart(this.http);
    this.CompositeCharts['syndromesByFacility'].loadData(
      "overview/syndromesByFacility",
      () => {
        let MCTemp = this.CompositeCharts['syndromesByFacility'];

        for (let index = 0; index < 4; index++) {
          MCTemp.ChartSeries.push([]);

          for (let j = 0; j < 10; j++) {
            MCTemp.ChartSeries[index].push(Math.floor(Math.random() * 100));
          }
        }

        MCTemp.LoadChartOptions();
      },
      () => {
        let MCTemp = this.CompositeCharts['syndromesByFacility'];
      },
      () => {
        let MCTemp = this.CompositeCharts['syndromesByFacility'];

        MCTemp.ChartOptions = {
          title: {
            text: 'Syndromes by Facility',
            align: 'left',
          },
          chart: {
            type: 'column',
          },
          xAxis: {
            categories: ["KNH", "MSA", "MRT", "BSA", "MLK", "NKS", "JTH", "MKU", "LTK", "KPG"],
            title: { text: '' },
          },
          yAxis: [
            {
              title: {
                text: 'Number Screened',
              }
            }
          ],
          plotOptions: {
            series: {
              stacking: 'normal',
            },
            bar: {
              pointWidth: 18,
            }
          },
          legend: { align: 'left', verticalAlign: 'top', y: 0, x: 80 },
          series: [
            {
              name: 'SARI',
              data: MCTemp.ChartSeries[0],
              color: '#234FEA',
            },
            {
              name: 'UF',
              data: MCTemp.ChartSeries[1],
              color: '#FF0000',
            },
            {
              name: 'DF',
              data: MCTemp.ChartSeries[2],
              color: '#008000',
            },
            {
              name: 'MERS-COV',
              data: MCTemp.ChartSeries[3],
              color: '#FFA500',
            }
          ],
          credits: {
            enabled: false,
          }
        }
      }
    );
    //#endregion

    //#region Load Chart --> Syndromes by over time
    this.CompositeCharts['syndromesOvertime'] = new AFIChart(this.http);
    this.CompositeCharts['syndromesOvertime'].loadData(
      "overview/syndromesOvertime",
      () => {
        let MCTemp = this.CompositeCharts['syndromesOvertime'];

        for (let index = 0; index < 4; index++) {
          MCTemp.ChartSeries.push([]);

          for (let j = 0; j < 10; j++) {
            MCTemp.ChartSeries[index].push(Math.floor(Math.random() * 100));
          }
        }

        MCTemp.LoadChartOptions();
      },
      () => {
        let MCTemp = this.CompositeCharts['syndromesOvertime'];
      },
      () => {
        let MCTemp = this.CompositeCharts['syndromesOvertime'];

        MCTemp.ChartOptions = {
          title: {
            text: 'Syndromes by Facility',
            align: 'left',
          },
          chart: {
            type: 'column',
          },
          xAxis: {
            categories: ["KNH", "MSA", "MRT", "BSA", "MLK", "NKS", "JTH", "MKU", "LTK", "KPG"],
            title: { text: '' },
          },
          yAxis: [
            {
              title: {
                text: 'Number Screened',
              }
            }
          ],
          plotOptions: {
            series: {
              stacking: 'normal',
            },
            bar: {
              pointWidth: 18,
            }
          },
          legend: { align: 'left', verticalAlign: 'top', y: 0, x: 80 },
          series: [
            {
              name: 'SARI',
              data: MCTemp.ChartSeries[0],
              color: '#234FEA',
              type: "spline"
            },
            {
              name: 'UF',
              data: MCTemp.ChartSeries[1],
              color: '#FF0000',
              type: "spline"
            },
            {
              name: 'DF',
              data: MCTemp.ChartSeries[2],
              color: '#008000',
              type: "spline"
            },
            {
              name: 'MERS-COV',
              data: MCTemp.ChartSeries[3],
              color: '#FFA500',
              type: "spline"
            }
          ],
          credits: {
            enabled: false,
          }
        }
      }
    );
    //#endregion

    HC_exporting(Highcharts);
  }
}
