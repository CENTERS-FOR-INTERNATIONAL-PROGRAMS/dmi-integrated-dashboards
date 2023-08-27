import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AFIChart } from '../../../models/afi/AFIChart.model';
import { ACParent } from '../../../models/afi/ACParent.model';

import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsSolidGauge from 'highcharts/modules/solid-gauge';

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
    //#region Load Chart --> Overall TAC-PCR Results
    this.CompositeCharts['overallResults'] = new AFIChart(this.http);
    this.CompositeCharts['overallResults'].loadData(
      "results_tac/overallResults",
      () => {
        let MCTemp = this.CompositeCharts['overallResults'];

        for (let index = 0; index < 2; index++) {
          MCTemp.ChartSeries.push([]);
          MCTemp.ChartSeries[index].push(Math.floor(Math.random() * 1000));
          MCTemp.ChartSeries[index].push(0);
        }

        MCTemp.LoadChartOptions();
      },
      () => {
        let MCTemp = this.CompositeCharts['overallResults'];
        MCTemp.ChartSeries = [];

        // Positive (Index --> 0)
        MCTemp.ChartSeries.push([]);
        MCTemp.ChartSeries[0].push(MCTemp.ChartData[0].PositiveNumber);
        MCTemp.ChartSeries[0].push(MCTemp.ChartData[0].PositivePercentage);

        // Negative (Index --> 1)
        MCTemp.ChartSeries.push([]);
        MCTemp.ChartSeries[1].push(MCTemp.ChartData[0].NegativeNumber);
        MCTemp.ChartSeries[1].push(MCTemp.ChartData[0].NegativePercentage);
      },
      () => {
        let MCTemp = this.CompositeCharts['overallResults'];

        MCTemp.ChartOptions = {
          title: {
            text: 'Overall TAC PCR Results',
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

    //#region Load Chart --> Pathogens Identified
    this.CompositeCharts['pathogensIdentified'] = new AFIChart(this.http);
    this.CompositeCharts['pathogensIdentified'].loadData(
      "results_tac/pathogensIdentified",
      () => {
        let MCTemp = this.CompositeCharts['pathogensIdentified'];

        for (let index = 0; index < 16; index++) {
          MCTemp.ChartSeries.push([]);
          MCTemp.ChartSeries[index].push(Math.floor(Math.random() * 1000));
          MCTemp.ChartSeries[index].push(0);
        }

        MCTemp.LoadChartOptions();
      },
      () => {
        let MCTemp = this.CompositeCharts['pathogensIdentified'];

        MCTemp.ChartSeries = [];
        for (let index = 0; index < 16; index++) {
          MCTemp.ChartSeries.push([]);
        }

        // Negative (Index --> 1)
        MCTemp.ChartSeries[0].push(MCTemp.ChartData[0].NegativeNumber);
        MCTemp.ChartSeries[0].push(MCTemp.ChartData[0].NegativePercentage);

        // Plasmodium (Index --> 1)
        MCTemp.ChartSeries[1].push(MCTemp.ChartData[0].PlasmodiumNumber);
        MCTemp.ChartSeries[1].push(MCTemp.ChartData[0].PlasmodiumPercentage);

        // HIV1 (Index --> 2)
        MCTemp.ChartSeries[2].push(MCTemp.ChartData[0].HIV1Number);
        MCTemp.ChartSeries[2].push(MCTemp.ChartData[0].HIV1Percentage);

        // Salmonella (Index --> 3)
        MCTemp.ChartSeries[3].push(MCTemp.ChartData[0].SalmonellaNumber);
        MCTemp.ChartSeries[3].push(MCTemp.ChartData[0].SalmonellaPercentage);

        // Rickettsia (Index --> 4)
        MCTemp.ChartSeries[4].push(MCTemp.ChartData[0].RickettsiaNumber);
        MCTemp.ChartSeries[4].push(MCTemp.ChartData[0].SalmonellaPercentage);

        // Dengue (Index --> 5)
        MCTemp.ChartSeries[5].push(MCTemp.ChartData[0].DengueNumber);
        MCTemp.ChartSeries[5].push(MCTemp.ChartData[0].DenguePercentage);

        // Brucella (Index --> 6)
        MCTemp.ChartSeries[6].push(MCTemp.ChartData[0].BrucellaNumber);
        MCTemp.ChartSeries[6].push(MCTemp.ChartData[0].BrucellaPercentage);

        // Chikungunya (Index --> 7)
        MCTemp.ChartSeries[7].push(MCTemp.ChartData[0].ChikungunyaNumber);
        MCTemp.ChartSeries[7].push(MCTemp.ChartData[0].ChikungunyaPercentage);

        // SPneumoniae (Index --> 8)
        MCTemp.ChartSeries[8].push(MCTemp.ChartData[0].SPneumoniaeNumber);
        MCTemp.ChartSeries[8].push(MCTemp.ChartData[0].SPneumoniaePercentage);

        // Leishmania (Index --> 9)
        MCTemp.ChartSeries[9].push(MCTemp.ChartData[0].LeishmaniaNumber);
        MCTemp.ChartSeries[9].push(MCTemp.ChartData[0].LeishmaniaPercentage);

        // Bartonella (Index --> 10)
        MCTemp.ChartSeries[10].push(MCTemp.ChartData[0].BartonellaNumber);
        MCTemp.ChartSeries[10].push(MCTemp.ChartData[0].BartonellaPercentage);

        // Leptospira (Index --> 11)
        MCTemp.ChartSeries[11].push(MCTemp.ChartData[0].LeptospiraNumber);
        MCTemp.ChartSeries[11].push(MCTemp.ChartData[0].LeptospiraPercentage);

        // Cburnetii (Index --> 12)
        MCTemp.ChartSeries[12].push(MCTemp.ChartData[0].CburnetiiNumber);
        MCTemp.ChartSeries[12].push(MCTemp.ChartData[0].CburnetiiPercentage);

        // Rift Valley Fever (Index --> 13)
        MCTemp.ChartSeries[13].push(MCTemp.ChartData[0].RiftValleyFeverNumber);
        MCTemp.ChartSeries[13].push(MCTemp.ChartData[0].RiftValleyFeverPercentage);

        // Bpseudomelle (Index --> 14)
        MCTemp.ChartSeries[14].push(MCTemp.ChartData[0].BpseudomelleNumber);
        MCTemp.ChartSeries[14].push(MCTemp.ChartData[0].BPseudomalleiPercentage);

        // Total (Index --> 15)
        MCTemp.ChartSeries[15].push(MCTemp.ChartData[0].TotalCount);
      },
      () => {
        let MCTemp = this.CompositeCharts['pathogensIdentified'];

        MCTemp.ChartOptions = {
          title: {
            text: 'Pathogens Identified',
            align: 'left'
          },
          chart: {
            type: "pie",
          },
          // colors: [
          //   "#FF0000",
          //   "#008000"
          // ],
          series: [
            {
              showInLegend: false,
              name: "Data",
              type: 'pie',
              data: [
                ["Plasmodium (" + MCTemp.ChartSeries[1][1] + "%)", MCTemp.ChartSeries[1][0]],
                ["HIV1 (" + MCTemp.ChartSeries[2][1] + "%)", MCTemp.ChartSeries[2][0]],
                ["Salmonella (" + MCTemp.ChartSeries[3][1] + "%)", MCTemp.ChartSeries[3][0]],
                ["Rickettsia (" + MCTemp.ChartSeries[4][1] + "%)", MCTemp.ChartSeries[4][0]],
                ["Dengue (" + MCTemp.ChartSeries[5][1] + "%)", MCTemp.ChartSeries[5][0]],
                ["Brucella (" + MCTemp.ChartSeries[6][1] + "%)", MCTemp.ChartSeries[6][0]],
                ["Chikungunya (" + MCTemp.ChartSeries[7][1] + "%)", MCTemp.ChartSeries[7][0]],
                ["S. Pneumoniae (" + MCTemp.ChartSeries[8][1] + "%)", MCTemp.ChartSeries[8][0]],
                ["Leishmania (" + MCTemp.ChartSeries[9][1] + "%)", MCTemp.ChartSeries[9][0]],
                ["Bartonella (" + MCTemp.ChartSeries[10][1] + "%)", MCTemp.ChartSeries[10][0]],
                ["Leptospira (" + MCTemp.ChartSeries[11][1] + "%)", MCTemp.ChartSeries[11][0]],
                ["Cburnetii (" + MCTemp.ChartSeries[12][1] + "%)", MCTemp.ChartSeries[12][0]],
                ["Rift Valley Fever (" + MCTemp.ChartSeries[13][1] + "%)", MCTemp.ChartSeries[13][0]],
                ["Bpseudomellei (" + MCTemp.ChartSeries[14][1] + "%)", MCTemp.ChartSeries[14][0]]
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
            }
          },
          credits: {
            enabled: false,
          }
        }
      }
    );
    //#endregion

    //#region Load Chart --> Syndromes over time
    this.CompositeCharts['syndromesOvertime'] = new AFIChart(this.http);
    this.CompositeCharts['syndromesOvertime'].loadData(
      "results_tac/syndromesOvertime",
      () => {
        let MCTemp = this.CompositeCharts['syndromesOvertime'];

        for (let index = 0; index < 2; index++) {
          MCTemp.ChartSeries.push([]);

          for (let j = 0; j < 12; j++) {
            MCTemp.ChartSeries[index].push(Math.floor(Math.random() * 100));
          }
        }

        MCTemp.LoadChartOptions();
      },
      () => {
        let MCTemp = this.CompositeCharts['syndromesOvertime'];

        MCTemp.ChartSeries = [];

        for (let index = 0; index < 15; index++) {
          MCTemp.ChartSeries.push([]);
        }

        MCTemp.ChartData.forEach(dataInstance => {
          // Epi Week (Index --> 0)
          MCTemp.ChartSeries[0].push(dataInstance.WeekNumber);

          // Plasmodium (Index --> 1)
          MCTemp.ChartSeries[1].push(dataInstance.PlasmodiumNumber);

          // HIV-1 (Index --> 2)
          MCTemp.ChartSeries[2].push(dataInstance.HIV1Number);

          // Salmonella (Index --> 3)
          MCTemp.ChartSeries[3].push(dataInstance.SalmonellaNumber);

          // Rickettsia (Index --> 4)
          MCTemp.ChartSeries[4].push(dataInstance.RickettsiaNumber);

          // Dengue (Index --> 5)
          MCTemp.ChartSeries[5].push(dataInstance.DengueNumber);

          // Brucella (Index --> 6)
          MCTemp.ChartSeries[6].push(dataInstance.BrucellaNumber);

          // Chikungunya (Index --> 7)
          MCTemp.ChartSeries[7].push(dataInstance.ChikungunyaNumber);

          // S. Pneumonie (Index --> 8)
          MCTemp.ChartSeries[8].push(dataInstance.SPneumonieNumber);

          // Leishmania (Index --> 9)
          MCTemp.ChartSeries[9].push(dataInstance.LeishmaniaNumber);

          // Bartonella (Index --> 10)
          MCTemp.ChartSeries[10].push(dataInstance.BartonellaNumber);

          // Leptospira (Index --> 11)
          MCTemp.ChartSeries[11].push(dataInstance.LeptospiraNumber);

          // Cburnetii (Index --> 12)
          MCTemp.ChartSeries[12].push(dataInstance.CburnetiiNumber);

          // Rift Valley Fever (Index --> 13)
          MCTemp.ChartSeries[13].push(dataInstance.RiftValleyFeverNumber);

          // Bpseudomellei (Index --> 14)
          MCTemp.ChartSeries[14].push(dataInstance.BpseudomelleNumber);
        });

        // "PlasmodiumPercentage": 75.324675324675,
        // "HIV1Percentage": 2.597402597402,
        // "SalmonellaPercentage": 2.597402597402,
        // "RickettsiaPercentage": 2.597402597402,
        // "DenguePercentage": 2.597402597402,
        // "BrucellaPercentage": 2.597402597402,
        // "ChikungunyaPercentage": 6.493506493506,
        // "SPneumoniePercentage": 2.597402597402,
        // "LeishmaniaPercentage": 1.298701298701,
        // "BartonellaPercentage": 0,
        // "LeptospiraPercentage": 1.298701298701,
        // "CburnetiiPercentage": 0,
        // "RiftValleyFeverPercentage": 0,
        // "BpseudomellePercentage": 0
      },
      () => {
        let MCTemp = this.CompositeCharts['syndromesOvertime'];

        MCTemp.ChartOptions = {
          title: {
            text: 'Syndromes over time',
            align: 'left',
          },
          chart: {
            type: 'column',
          },
          xAxis: {
            categories: MCTemp.ChartSeries[0],
            title: { text: 'Epi Week' },
          },
          yAxis: [
            {
              title: {
                text: 'Count',
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
              name: 'Plasmodium',
              data: MCTemp.ChartSeries[1],
              type: 'spline'
            },
            {
              name: 'HIV-1',
              data: MCTemp.ChartSeries[2],
              type: 'spline'
            },
            {
              name: 'Salmonella',
              data: MCTemp.ChartSeries[3],
              type: 'spline'
            },
            {
              name: 'Rickettsia',
              data: MCTemp.ChartSeries[4],
              type: 'spline'
            },
            {
              name: 'Dengue',
              data: MCTemp.ChartSeries[5],
              type: 'spline'
            },
            {
              name: 'Brucella',
              data: MCTemp.ChartSeries[6],
              type: 'spline'
            },
            {
              name: 'Chikungunya',
              data: MCTemp.ChartSeries[7],
              type: 'spline'
            },
            {
              name: 'S. Pneumonie',
              data: MCTemp.ChartSeries[8],
              type: 'spline'
            },
            {
              name: 'Leishmania',
              data: MCTemp.ChartSeries[9],
              type: 'spline'
            },
            {
              name: 'Bartonella',
              data: MCTemp.ChartSeries[10],
              type: 'spline'
            },
            {
              name: 'Leptospira',
              data: MCTemp.ChartSeries[11],
              type: 'spline'
            },
            {
              name: 'Cburnetii',
              data: MCTemp.ChartSeries[12],
              type: 'spline'
            },
            {
              name: 'Rift Valley Fever',
              data: MCTemp.ChartSeries[13],
              type: 'spline'
            },
            {
              name: 'Bpseudomellei',
              data: MCTemp.ChartSeries[14],
              type: 'spline'
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
