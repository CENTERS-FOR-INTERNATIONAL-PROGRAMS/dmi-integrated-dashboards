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
  templateUrl: 'results.component.html',
  styleUrls: ['results.component.scss']
})

export class AResultsComponent implements OnInit {
  //#region Prerequisites
  CompositeCharts: ACParent = {};
  highcharts = Highcharts;
  //#endregion

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadCharts();
  }

  loadCharts() {
    //#region Load Chart --> Malaria Results 
    this.CompositeCharts['malariaResults'] = new AFIChart(this.http);
    this.CompositeCharts['malariaResults'].loadData(
      "overview/malariaResults",
      () => {
        let MCTemp = this.CompositeCharts['malariaResults'];

        for (let index = 0; index < 2; index++) {
          MCTemp.ChartSeries.push([]);
          MCTemp.ChartSeries[index].push(Math.floor(Math.random() * 1000));
          MCTemp.ChartSeries[index].push(0);
        }

        MCTemp.LoadChartOptions();
      },
      () => {
        let MCTemp = this.CompositeCharts['malariaResults'];
      },
      () => {
        let MCTemp = this.CompositeCharts['malariaResults'];

        MCTemp.ChartOptions = {
          title: {
            text: 'Malaria Results',
            align: 'left'
          },
          chart: {
            type: "pie",
          },
          colors: [
            "#FF0000",
            "#008000"
          ],
          series: [
            {
              showInLegend: true,
              name: "Data",
              type: 'pie',
              data: [
                ["Positive (" + MCTemp.ChartSeries[0][1] + "%)", MCTemp.ChartSeries[0][0]],
                ["Negative (" + MCTemp.ChartSeries[1][1] + "%)", MCTemp.ChartSeries[1][0]]
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

    //#region Load Chart --> Malaria Positive Results 
    this.CompositeCharts['malariaPositiveResults'] = new AFIChart(this.http);
    this.CompositeCharts['malariaPositiveResults'].loadData(
      "overview/malariaPositiveResults",
      () => {
        let MCTemp = this.CompositeCharts['malariaPositiveResults'];

        for (let index = 0; index < 4; index++) {
          MCTemp.ChartSeries.push([]);
          MCTemp.ChartSeries[index].push(Math.floor(Math.random() * 1000));
          MCTemp.ChartSeries[index].push(0);
        }

        MCTemp.LoadChartOptions();
      },
      () => {
        let MCTemp = this.CompositeCharts['malariaPositiveResults'];
      },
      () => {
        let MCTemp = this.CompositeCharts['malariaPositiveResults'];

        MCTemp.ChartOptions = {
          title: {
            text: 'Malaria Positive Results',
            align: 'left'
          },
          chart: {
            type: "pie",
          },
          colors: [
            "#FFA500",
            "#FF0000",
            "#234FEA",
            "#008000"
          ],
          series: [
            {
              showInLegend: true,
              name: "Data",
              type: 'pie',
              data: [
                ["Inspeciated (" + MCTemp.ChartSeries[0][1] + "%)", MCTemp.ChartSeries[0][0]],
                ["Pan malaria (" + MCTemp.ChartSeries[1][1] + "%)", MCTemp.ChartSeries[1][0]],
                ["P. falciparum (" + MCTemp.ChartSeries[2][1] + "%)", MCTemp.ChartSeries[1][0]],
                ["Mixed infection (" + MCTemp.ChartSeries[3][1] + "%)", MCTemp.ChartSeries[1][0]]
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

    //#region Load Chart --> Leptospirosis Results 
    this.CompositeCharts['leptospirosisResults'] = new AFIChart(this.http);
    this.CompositeCharts['leptospirosisResults'].loadData(
      "overview/leptospirosisResults",
      () => {
        let MCTemp = this.CompositeCharts['leptospirosisResults'];

        for (let index = 0; index < 2; index++) {
          MCTemp.ChartSeries.push([]);
          MCTemp.ChartSeries[index].push(Math.floor(Math.random() * 1000));
          MCTemp.ChartSeries[index].push(0);
        }

        MCTemp.LoadChartOptions();
      },
      () => {
        let MCTemp = this.CompositeCharts['leptospirosisResults'];
      },
      () => {
        let MCTemp = this.CompositeCharts['leptospirosisResults'];

        MCTemp.ChartOptions = {
          title: {
            text: 'Leptospirosis Results',
            align: 'left'
          },
          chart: {
            type: "pie",
          },
          colors: [
            "#FF0000",
            "#008000"
          ],
          series: [
            {
              showInLegend: true,
              name: "Data",
              type: 'pie',
              data: [
                ["Positive (" + MCTemp.ChartSeries[0][1] + "%)", MCTemp.ChartSeries[0][0]],
                ["Negative (" + MCTemp.ChartSeries[1][1] + "%)", MCTemp.ChartSeries[1][0]]
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

    //#region Load Chart --> RDT Positive Results Distribution by Health Facility
    this.CompositeCharts['RDTResultsByFacility'] = new AFIChart(this.http);
    this.CompositeCharts['RDTResultsByFacility'].loadData(
      "overview/RDTResultsByFacility",
      () => {
        let MCTemp = this.CompositeCharts['RDTResultsByFacility'];

        for (let index = 0; index < 2; index++) {
          MCTemp.ChartSeries.push([]);

          for (let j = 0; j < 12; j++) {
            MCTemp.ChartSeries[index].push(Math.floor(Math.random() * 100));
          }
        }

        MCTemp.LoadChartOptions();
      },
      () => {
        let MCTemp = this.CompositeCharts['RDTResultsByFacility'];
      },
      () => {
        let MCTemp = this.CompositeCharts['RDTResultsByFacility'];

        MCTemp.ChartOptions = {
          title: {
            text: 'RDT Positive Results Distribution by Health Facility',
            align: 'left',
          },
          chart: {
            type: 'column',
          },
          xAxis: {
            categories: ["KAK", "BSA", "KKM", "MSA", "JTH", "KPG", "MLK", "KNH", "NKS", "MKU", "LTK", "MDN"],
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
              name: 'Leptospirosis',
              data: MCTemp.ChartSeries[0],
              color: '#234FEA',
            },
            {
              name: 'Malaria',
              data: MCTemp.ChartSeries[1],
              color: '#FF0000',
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
