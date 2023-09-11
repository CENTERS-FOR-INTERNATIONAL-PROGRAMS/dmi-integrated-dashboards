import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Chart } from '../../../models/afi/Chart.model';
import { ChartParent } from '../../../models/afi/ChartParent.model';
import { IDFilter } from '../../../models/IDFilter.model';
import { IDFacility } from '../../../models/IDFacility.model';
import { APIReader } from '../../../models/APIReader.model';

import * as Highcharts from 'highcharts/highstock';
import HC_exporting from 'highcharts/modules/exporting';

@Component({
  templateUrl: 'results.component.html',
  styleUrls: ['results.component.scss']
})

export class AResultsComponent implements OnInit {
  //#region Prerequisites
  APIReaderInstance = new APIReader(this.http);
  DataFilterInstance = new IDFilter();
  CompositeFacilities: any[] = [];

  CompositeCharts: ChartParent = {};
  highcharts = Highcharts;
  //#endregion

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadCharts();
    this.loadFilters();
  }

  formatLabel(value: number): string {
    return `${value}`;
  }

  loadFilters() {
    //#region Acquire composite facilities
    this.APIReaderInstance.loadData("mortality_ncov/acquireCompositeFacilities", () => {
      this.APIReaderInstance.CompositeData.forEach((dataInstance: any) => {
        this.CompositeFacilities.push(new IDFacility(
          dataInstance['facility_id'],
          dataInstance['facility_code'],
          dataInstance['facility_name']));
      });
    });
    //#endregion
  }

  processFilters() {
    this.DataFilterInstance.processDates();

    //#region Reload all charts
    Object.keys(this.CompositeCharts).forEach(chart_ident => {
      this.CompositeCharts[chart_ident].ChartFilterData = this.DataFilterInstance;
      this.CompositeCharts[chart_ident].reloadData();
    });
    //#endregion
  }

  loadCharts() {
    //#region Load Chart --> Malaria Results 
    this.CompositeCharts['malariaResults'] = new Chart(this.http);
    this.CompositeCharts['malariaResults'].loadData(
      "results_rdt/malariaResults",
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

        // Positive (Index --> 0)
        MCTemp.ChartSeries[0][0] = MCTemp.ChartData[0].PositiveNumber;
        MCTemp.ChartSeries[0][1] = MCTemp.ChartData[0].PositivePercentage;

        // Negative (Index --> 0)
        MCTemp.ChartSeries[1][0] = MCTemp.ChartData[0].NegativeNumber;
        MCTemp.ChartSeries[1][1] = MCTemp.ChartData[0].NegativePercentage;
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

    //#region Load Chart --> Leptospirosis Results 
    this.CompositeCharts['leptospirosisResults'] = new Chart(this.http);
    this.CompositeCharts['leptospirosisResults'].loadData(
      "results_rdt/leptospirosisResults",
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

        MCTemp.ChartSeries[0][0] = MCTemp.ChartData[0].PositiveNumber;
        MCTemp.ChartSeries[0][1] = MCTemp.ChartData[0].PositivePercentage;

        // Negative (Index --> 0)
        MCTemp.ChartSeries[1][0] = MCTemp.ChartData[0].NegativeNumber;
        MCTemp.ChartSeries[1][1] = MCTemp.ChartData[0].NegativePercentage;
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

    //#region Load Chart --> Malaria Positive Results 
    this.CompositeCharts['malariaPositiveResults'] = new Chart(this.http);
    this.CompositeCharts['malariaPositiveResults'].loadData(
      "results_rdt/malariaPositiveResults",
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

        // Unspeciated (Index --> 0)
        MCTemp.ChartSeries[0][0] = MCTemp.ChartData[0].UnspeciatedNumber;
        MCTemp.ChartSeries[0][1] = MCTemp.ChartData[0].UnspeciatedPercentage;

        // Pan malaria (Index --> 1)
        MCTemp.ChartSeries[1][0] = MCTemp.ChartData[0].PanMalariaNumber;
        MCTemp.ChartSeries[1][1] = MCTemp.ChartData[0].PanMalariaPercentage;

        // P. falciparum (Index --> 2)
        MCTemp.ChartSeries[2][0] = MCTemp.ChartData[0].PFalciparumNumber;
        MCTemp.ChartSeries[2][1] = MCTemp.ChartData[0].PFalciparumPercentage;

        // Mixed infection (Index --> 3)
        MCTemp.ChartSeries[3][0] = MCTemp.ChartData[0].MixedInfectionNumber;
        MCTemp.ChartSeries[3][1] = MCTemp.ChartData[0].MixedInfectionPercentage;
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
                ["Unspeciated (" + MCTemp.ChartSeries[0][1] + "%)", MCTemp.ChartSeries[0][0]],
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

    //#region Load Chart --> RDT Positive Results Distribution by Health Facility
    this.CompositeCharts['RDTResultsByFacility'] = new Chart(this.http);
    this.CompositeCharts['RDTResultsByFacility'].loadData(
      "results_rdt/RDTResultsByFacility",
      () => {
        let MCTemp = this.CompositeCharts['RDTResultsByFacility'];

        MCTemp.LoadChartOptions();
      },
      () => {
        let MCTemp = this.CompositeCharts['RDTResultsByFacility'];

        // Facility (Index --> 0)
        MCTemp.ChartSeries.push([]);

        // Leptospirosis (Index --> 1)
        MCTemp.ChartSeries.push([]);

        // Malaria (Index --> 2)
        MCTemp.ChartSeries.push([]);

        MCTemp.ChartData.forEach(dataInstance => {
          MCTemp.ChartSeries[0].push(dataInstance.HealthFacility);
          MCTemp.ChartSeries[1].push(dataInstance.LeptospirosisNumber);
          MCTemp.ChartSeries[2].push(dataInstance.MalariaNumber);
        });
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
            categories: MCTemp.ChartSeries[0],
            title: { text: '' },
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
              name: 'Leptospirosis',
              data: MCTemp.ChartSeries[1],
              color: '#234FEA',
            },
            {
              name: 'Malaria',
              data: MCTemp.ChartSeries[2],
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

    //#region Load Chart --> Percent Malaria RDT Positive Results over time
    this.CompositeCharts['malariaPositiveResultsOverTime'] = new Chart(this.http);
    this.CompositeCharts['malariaPositiveResultsOverTime'].loadData(
      "results_rdt/malariaPositiveResultsOverTime",
      () => {
        let MCTemp = this.CompositeCharts['malariaPositiveResultsOverTime'];

        MCTemp.LoadChartOptions();
      },
      () => {
        let MCTemp = this.CompositeCharts['malariaPositiveResultsOverTime'];

        // Epi Week (Index --> 0)
        MCTemp.ChartSeries.push([]);

        // Samples Tested (Index --> 1)
        MCTemp.ChartSeries.push([]);

        // Malaria Positive (%) (Index --> 2)
        MCTemp.ChartSeries.push([]);

        MCTemp.ChartData.forEach((dataInstance) => {
          // Epi Week (Index --> 0)
          MCTemp.ChartSeries[0].push(dataInstance.WeekNumber);

          // Samples Tested (Index --> 1)
          MCTemp.ChartSeries[1].push(dataInstance.SamplesTestedNumber);

          // Malaria Positive (%) (Index --> 2)
          MCTemp.ChartSeries[2].push(dataInstance.PositivePercentage);
        });
      },
      () => {
        let MCTemp = this.CompositeCharts['malariaPositiveResultsOverTime'];

        MCTemp.ChartOptions = {
          title: {
            text: 'Percent Malaria RDT Positive Results over time',
            align: 'left',
          },
          chart: {
            type: 'column',
          },
          xAxis: {
            categories: MCTemp.ChartSeries[0],
            title: { text: 'Epi Week' },
            min: 0,
            max: 22,
            scrollbar: {
              enabled: true
            }
          },
          yAxis: [
            {
              title: {
                text: 'Sample Tested',
              }
            },
            {
              opposite: true,
              title: {
                text: '% Malaria Positive',
                rotation: 270
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
              name: 'Sample Tested',
              data: MCTemp.ChartSeries[1],
              color: '#234FEA',
            },
            {
              name: 'Malaria Positive',
              data: MCTemp.ChartSeries[2],
              color: '#FF0000',
              type: 'spline',
              yAxis: 1
            }
          ],
          useHighStocks: true,
          credits: {
            enabled: false,
          }
        }
      }
    );
    //#endregion

    //#region Load Chart --> Percent Leptospirosis RDT Positive Results over time
    this.CompositeCharts['leptospirosisPositiveResultsOverTime'] = new Chart(this.http);
    this.CompositeCharts['leptospirosisPositiveResultsOverTime'].loadData(
      "results_rdt/leptospirosisPositiveResultsOverTime",
      () => {
        let MCTemp = this.CompositeCharts['leptospirosisPositiveResultsOverTime'];

        MCTemp.LoadChartOptions();
      },
      () => {
        let MCTemp = this.CompositeCharts['leptospirosisPositiveResultsOverTime'];

        // Epi Week (Index --> 0)
        MCTemp.ChartSeries.push([]);

        // Samples Tested (Index --> 1)
        MCTemp.ChartSeries.push([]);

        // Malaria Positive (%) (Index --> 2)
        MCTemp.ChartSeries.push([]);

        MCTemp.ChartData.forEach((dataInstance) => {
          // Epi Week (Index --> 0)
          MCTemp.ChartSeries[0].push(dataInstance.WeekNumber);

          // Samples Tested (Index --> 1)
          MCTemp.ChartSeries[1].push(dataInstance.SamplesTestedNumber);

          // Leptospirosis Positive (%) (Index --> 2)
          MCTemp.ChartSeries[2].push(dataInstance.PositivePercentage);
        });
      },
      () => {
        let MCTemp = this.CompositeCharts['leptospirosisPositiveResultsOverTime'];

        MCTemp.ChartOptions = {
          title: {
            text: 'Percent Leptospirosis RDT Positive Results over time',
            align: 'left',
          },
          chart: {
            type: 'column',
          },
          xAxis: {
            categories: MCTemp.ChartSeries[0],
            title: { text: 'Epi Week' },
            min: 0,
            max: 22,
            scrollbar: {
              enabled: true
            }
          },
          yAxis: [
            {
              title: {
                text: 'Sample Tested',
              }
            },
            {
              opposite: true,
              title: {
                text: '% Leptospirosis Positive',
                rotation: 270
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
              name: 'Sample Tested',
              data: MCTemp.ChartSeries[1],
              color: '#234FEA',
            },
            {
              name: 'Leptospirosis Positive',
              data: MCTemp.ChartSeries[2],
              color: '#FF0000',
              type: 'spline',
              yAxis: 1
            }
          ],
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
