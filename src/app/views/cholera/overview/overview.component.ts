import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Chart } from '../../../models/cholera/CholeraChart.model';
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
    //#region Load Chart --> Cases by gender
    this.CompositeCharts['casesByGender'] = new Chart(this.http);
    this.CompositeCharts['casesByGender'].loadData(
      "overview/casesByGender",
      () => {
        let MCTemp = this.CompositeCharts['casesByGender'];

        for (let index = 0; index < 2; index++) {
          MCTemp.ChartSeries.push([]);
          MCTemp.ChartSeries[index].push(Math.floor(Math.random() * 1000));
          MCTemp.ChartSeries[index].push(0);
        }

        MCTemp.LoadChartOptions();
      },
      () => {
        let MCTemp = this.CompositeCharts['casesByGender'];

        MCTemp.ChartData.forEach(dataInstance => {
          // Female Data (Index --> 0)
          if (dataInstance.Gender == "Female") {
            MCTemp.ChartSeries[0][0] = dataInstance.CasesNumber;
            MCTemp.ChartSeries[0][1] = 0;
          }

          // Male Data (Index --> 1)
          else if (dataInstance.Gender == "Male") {
            MCTemp.ChartSeries[1][0] = dataInstance.CasesNumber;
            MCTemp.ChartSeries[1][1] = 0;
          }
        });
      },
      () => {
        let MCTemp = this.CompositeCharts['casesByGender'];

        MCTemp.ChartOptions = {
          title: {
            text: 'Cases By Gender',
            align: 'left'
          },
          chart: {
            type: "pie",
          },
          colors: [
            "#FFA500",
            "#234FEA",
          ],
          series: [
            {
              name: "Data",
              type: 'pie',
              data: [
                ["Female (" + MCTemp.ChartSeries[0][0] + ")", MCTemp.ChartSeries[0][0]],
                ["Male (" + MCTemp.ChartSeries[1][0] + ")", MCTemp.ChartSeries[1][0]]
              ]
            }
          ],
          plotOptions: {
            pie: {
              innerSize: "70%",
              depth: 25,
              dataLabels: {
                enabled: true
              },
            },
          },
          credits: {
            enabled: false,
          }
        }
      }
    );
    //#endregion

    //#region Load Chart --> Cases over time
    this.CompositeCharts['casesOverTime'] = new Chart(this.http);
    this.CompositeCharts['casesOverTime'].loadData(
      "overview/casesOverTime",
      () => {
        let MCTemp = this.CompositeCharts['casesOverTime'];

        MCTemp.LoadChartOptions();
      },
      () => {
        let MCTemp = this.CompositeCharts['casesOverTime'];

        //#region Init series indexes
        // EpiWeek (Index --> 0)
        MCTemp.ChartSeries.push([]);

        // Cases (Index --> 1)
        MCTemp.ChartSeries.push([]);
        //#endregion

        //#region Push series data into array at specific indexes
        MCTemp.ChartData.forEach(dataInstance => {
          //Compile EpiWeek
          MCTemp.ChartSeries[0].push(dataInstance.EpiWeek);

          //Compile Cases 
          MCTemp.ChartSeries[1].push(dataInstance.CasesNumber);
        });
        //#endregion
      },
      () => {
        let MCTemp = this.CompositeCharts['casesOverTime'];

        MCTemp.ChartOptions = {
          title: {
            text: 'Cases over time',
            align: 'left'
          },
          chart: {
            type: "spline"
          },
          xAxis: {
            categories: MCTemp.ChartSeries[0],
            min: 0,
            max: 12,
            scrollbar: {
              enabled: true
            }
          },
          yAxis: {
            title: {
              text: "Number of Cases",
            }
          },
          series: [
            {
              name: "Epi Week",
              data: MCTemp.ChartSeries[1],
              color: "#234FEA",
              type: "spline"
            }
          ],
          plotOptions: {
            spline: {
              dataLabels: {
                enabled: true,
                useHTML: true,
                format: "{y}"
              }
            }
          },
          tooltip: {
            format:
              '{series.name}: {x}, Cases: {y}'
          },
          useHighStocks: true,
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