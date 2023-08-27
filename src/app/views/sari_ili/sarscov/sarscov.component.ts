import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { SARIILIChart } from '../../../models/sari_ili/SARIILIChart.model';
import { SCParent } from '../../../models/sari_ili/SCParent.model';

import * as Highcharts from 'highcharts/highstock';
import HC_exporting from 'highcharts/modules/exporting';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsMap from "highcharts/modules/map"
import HighchartsSolidGauge from 'highcharts/modules/solid-gauge';
import HighchartsTreeMap from 'highcharts/modules/treemap';
import HighchartsTreeGraph from 'highcharts/modules/treegraph';
import topography from '../../../data/world.geojson.json'
import topographyData from '../../../data/afi_pathogen_facility.json'

HighchartsMore(Highcharts);
HighchartsSolidGauge(Highcharts);
HighchartsMap(Highcharts);
HighchartsTreeMap(Highcharts);
HighchartsTreeGraph(Highcharts);

@Component({
  templateUrl: 'sarscov.component.html',
  styleUrls: ['sarscov.component.scss']
})

export class SARSCOV2Component implements OnInit {
  //#region Prerequisites
  highcharts = Highcharts;
  CompositeCharts: SCParent = {};
  //#endregion

  constructor(private http: HttpClient) { }

  ngOnInit(): void {

    this.loadCharts();

  }

  loadCharts() {
    //#region Load Chart --> ILI & SARI SARS-COV-2 Cascade
    this.CompositeCharts['influenzaCascade'] = new SARIILIChart(this.http);
    this.CompositeCharts['influenzaCascade'].loadData(
      "sarscov/influenzaCascade",
      () => {
        let MCTemp = this.CompositeCharts['influenzaCascade'];

        MCTemp.LoadChartOptions();
      },
      () => {
        let MCTemp = this.CompositeCharts['influenzaCascade'];
      },
      () => {
        let MCTemp = this.CompositeCharts['influenzaCascade'];

        MCTemp.ChartOptions = {
          chart: {
            spacingBottom: 30,
            marginRight: 120
          },
          title: {
            align: 'center',
            text: 'ILI & SARI SARS-COV-2 Cascade'
          },
          series: [
            {
              type: 'treegraph',
              keys: ['parent', 'id', 'info'],
              clip: false,
              data: [
                [undefined, 'Screened', 7000],
                ['Screened', 'Eligible', 6809],
                ['Screened', 'Not-Eligible', 0],
                ['Eligible', 'Enrolled', 6809],
                ['Eligible', 'Not-Enrolled', 0],
                ['Enrolled', 'Tested', 6446],
                ['Enrolled', 'Not-Tested', 363],
                ['Tested', 'Negative', 13453],
                ['Tested', 'Positive', 1064]
              ],
              marker: {
                symbol: 'circle',
                radius: 6,
                fillColor: '#ffffff',
                lineWidth: 3
              },
              dataLabels: {
                align: 'left',
                pointFormat: '{point.id} ({point.info})',
                style: {
                  color: '#000000',
                  textOutline: '3px #ffffff',
                  whiteSpace: 'nowrap'
                },
                x: 24,
                crop: false,
                overflow: 'none'
              },
              levels: [
                {
                  level: 1,
                  levelIsConstant: false
                },
                {
                  level: 2,
                  colorByPoint: true
                },
                {
                  level: 3,
                  colorByPoint: true,
                },
                {
                  level: 4,
                  colorByPoint: true,
                },
                {
                  level: 5,
                  colorByPoint: true,
                },
                {
                  level: 6,
                  colorByPoint: true,
                  dataLabels: {
                    x: 10
                  },
                  marker: {
                    radius: 4
                  }
                }
              ]
            }
          ],
          credits: {
            enabled: false,
          }
        }
      }
    );
    //#endregion

    //#region Load Chart --> Tested for SARS-COV-2 by Age Category (Tested for SARS-COV-2 by Age Group)
    this.CompositeCharts['testedByAgeGroup'] = new SARIILIChart(this.http);
    this.CompositeCharts['testedByAgeGroup'].loadData(
      "sarscov/testedByAgeGroup",
      () => {
        let MCTemp = this.CompositeCharts['testedByAgeGroup'];

        MCTemp.LoadChartOptions();
      },
      () => {
        let MCTemp = this.CompositeCharts['testedByAgeGroup'];

        // Age Group (Index --> 0)
        MCTemp.ChartSeries.push([]);

        // SARS-COV-2 Tested Number (Index --> 1)
        MCTemp.ChartSeries.push([]);

        // SARS-COV-2 Tested Percentage (Index --> 2)
        MCTemp.ChartSeries.push([]);

        MCTemp.ChartData.forEach((dataInstance) => {
          MCTemp.ChartSeries[0].push(dataInstance.AgeCategory);
          MCTemp.ChartSeries[1].push(dataInstance.SARSCOV2TestedNumber);
          MCTemp.ChartSeries[2].push(dataInstance.SARSCOV2TestedPercentage);
        });
      },
      () => {
        let MCTemp = this.CompositeCharts['testedByAgeGroup'];

        MCTemp.ChartOptions = {
          title: {
            text: 'Tested for SARS-COV-2 by Age Category',
            align: 'left',
          },
          chart: {
            type: 'bar',
          },
          xAxis: [
            {
              categories: MCTemp.ChartSeries[0],
              title: { text: '' },
            }
          ],
          yAxis: [
            {
              title: {
                text: 'Number Enrolled',
              }
            },
            {
              title: {
                text: 'Percentage Enrolled',
              },
              labels: {
                format: '{value}%', //TODO! Format to remove netagive values
              },
              opposite: true
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
          tooltip: {
            format:
              '<b>{series.name}, {point.category}, {y}</b>'
          },
          legend: { align: 'left', verticalAlign: 'top', y: 0, x: 80 },
          series: [
            {
              name: 'Enrolled Number',
              data: MCTemp.ChartSeries[1],
              color: '#234FEA',
            },
            {
              name: 'Enrolled Percentage',
              data: MCTemp.ChartSeries[2],
              color: '#FFA500',
              type: "spline",
              yAxis: 1
            }
          ],
          credits: {
            enabled: false,
          }
        }
      }
    );
    //#endregion

    //#region Load Chart --> SARS-COV-2 Positive Distribution by Age Category
    this.CompositeCharts['positiveDistributionByAgeGroup'] = new SARIILIChart(this.http);
    this.CompositeCharts['positiveDistributionByAgeGroup'].loadData(
      "sarscov/positiveDistributionByAgeGroup",
      () => {
        let MCTemp = this.CompositeCharts['positiveDistributionByAgeGroup'];

        MCTemp.LoadChartOptions();
      },
      () => {
        let MCTemp = this.CompositeCharts['positiveDistributionByAgeGroup'];

        // Age Group (Index --> 0)
        MCTemp.ChartSeries.push([]);

        // SARS-COV-2 Positive Number (Index --> 1)
        MCTemp.ChartSeries.push([]);

        // SARS-COV-2 Positive Percentage (Index --> 2)
        MCTemp.ChartSeries.push([]);

        MCTemp.ChartData.forEach((dataInstance) => {
          MCTemp.ChartSeries[0].push(dataInstance.AgeCategory);
          MCTemp.ChartSeries[1].push(dataInstance.SARSCOV2PositiveNumber);
          MCTemp.ChartSeries[2].push(dataInstance.SARSCOV2PositivePercentage);
        });
      },
      () => {
        let MCTemp = this.CompositeCharts['positiveDistributionByAgeGroup'];

        MCTemp.ChartOptions = {
          title: {
            text: 'SARS-COV-2 Positive Distribution by Age Category',
            align: 'left',
          },
          chart: {
            type: 'bar',
          },
          xAxis: [
            {
              categories: MCTemp.ChartSeries[0],
              title: { text: '' },
            }
          ],
          yAxis: [
            {
              title: {
                text: 'Number Positive',
              }
            },
            {
              title: {
                text: 'Percentage Positive',
              },
              labels: {
                format: '{value}%', //TODO! Format to remove netagive values
              },
              opposite: true
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
          tooltip: {
            format:
              '<b>{series.name}, {point.category}, {y}</b>'
          },
          legend: { align: 'left', verticalAlign: 'top', y: 0, x: 80 },
          series: [
            {
              name: 'Positive Number',
              data: MCTemp.ChartSeries[1],
              color: '#234FEA',
            },
            {
              name: 'Positive Percentage',
              data: MCTemp.ChartSeries[2],
              color: '#FFA500',
              type: "spline",
              yAxis: 1,
            }
          ],
          credits: {
            enabled: false,
          }
        }
      }
    );
    //#endregion

    //#region Load Chart --> Number of Speciment Tested and % Positive for SARS-COV-2 over time
    this.CompositeCharts['SARSCOV2PositiveOvertime'] = new SARIILIChart(this.http);
    this.CompositeCharts['SARSCOV2PositiveOvertime'].loadData(
      "sarscov/SARSCOV2PositiveOvertime",
      () => {
        let MCTemp = this.CompositeCharts['SARSCOV2PositiveOvertime'];
        MCTemp.LoadChartOptions();
      },
      () => {
        let MCTemp = this.CompositeCharts['SARSCOV2PositiveOvertime'];

        // Initialize series array
        for (let index = 0; index < 4; index++) {
          MCTemp.ChartSeries.push([]);
        }

        MCTemp.ChartData.forEach(dataInstance => {
          //Compile Epi Week (Index --> 0)
          MCTemp.ChartSeries[0].push(dataInstance.EpiWeek);

          //Compile Covid Tested Number (Index --> 1)
          MCTemp.ChartSeries[1].push(dataInstance.CovidTestedNumber);

          //Compile SARS-COV-2 Positive Percentage (Index --> 2)
          MCTemp.ChartSeries[2].push(dataInstance.SARSCOV2PositivePercentage);
        });
      },
      () => {
        let MCTemp = this.CompositeCharts['SARSCOV2PositiveOvertime'];

        MCTemp.ChartOptions = {
          title: {
            text: 'Number of Speciment Tested and % Positive for SARS-COV-2 over time',
            align: 'left'
          },
          chart: {
            type: "column",
          },
          xAxis: {
            categories: MCTemp.ChartSeries[0],
            title: false,
            min: 0,
            max: 22,
            scrollbar: {
              enabled: true
            }
          },
          yAxis: [{
            title: {
              text: "Number tested for Covid",
            }
          },
          {
            title: {
              text: "(%) SARS-COV-2 Positive",
              rotation: 270,
            },
            opposite: true
          }],
          series: [
            {
              showInLegend: true,
              name: "Tested for Covid",
              data: MCTemp.ChartSeries[1],
              type: 'column',
              color: "#234FEA"
            },
            {
              showInLegend: true,
              name: "Percentage SARS-COV-2 Positive",
              data: MCTemp.ChartSeries[2],
              type: 'spline',
              yAxis: 1,
              color: "#FF0000"
            }
          ],
          plotOptions: {
            column: {
              stacking: 'normal',
              dataLabels: {
                enabled: true
              }
            }
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