import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { AFIProperties } from '../../../models/afi/AFIProperties.model';
import { Chart } from '../../../models/afi/Chart.model';
import { ChartParent } from '../../../models/afi/ChartParent.model';
import { IDFilter } from '../../../models/IDFilter.model';
import { IDFacility } from '../../../models/IDFacility.model';
import { APIReader } from '../../../models/APIReader.model';

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
    //#region Load Chart --> Syndromes
    this.CompositeCharts['syndromes'] = new Chart(this.http);
    this.CompositeCharts['syndromes'].loadData(
      "syndromic_cases/syndromes",
      () => {
        let MCTemp = this.CompositeCharts['syndromes'];

        for (let index = 0; index < 4; index++) {
          MCTemp.ChartSeries.push([]);
          MCTemp.ChartSeries[index].push(Math.floor(Math.random() * 1000));
          MCTemp.ChartSeries[index].push(0);
        }

        MCTemp.LoadChartOptions();
      },
      () => {
        let MCTemp = this.CompositeCharts['syndromes'];

        // UF (Index --> 0)
        MCTemp.ChartSeries[0][0] = MCTemp.ChartData[0].UFNumber;
        MCTemp.ChartSeries[0][1] = MCTemp.ChartData[0].UFPercentage;

        // MERS CoV (Index --> 0)
        MCTemp.ChartSeries[1][0] = MCTemp.ChartData[0].MERSCovNumber;
        MCTemp.ChartSeries[1][1] = MCTemp.ChartData[0].MERSCovPercentage;

        // DF (Index --> 0)
        MCTemp.ChartSeries[2][0] = MCTemp.ChartData[0].DFNumber;
        MCTemp.ChartSeries[2][1] = MCTemp.ChartData[0].DFPercentage;

        // SARI (Index --> 0)
        MCTemp.ChartSeries[3][0] = MCTemp.ChartData[0].SARINumber;
        MCTemp.ChartSeries[3][1] = MCTemp.ChartData[0].SARIPercentage;
      },
      () => {
        let MCTemp = this.CompositeCharts['syndromes'];

        MCTemp.ChartOptions = {
          title: {
            text: 'Syndromes',
            align: 'left'
          },
          chart: {
            type: "pie",
          },
          // colors: [
          // "#234FEA",
          // "#FFA500"
          // ],
          series: [
            {
              showInLegend: true,
              name: "Data",
              type: 'pie',
              data: [
                ["UF (" + MCTemp.ChartSeries[0][1] + "%)", MCTemp.ChartSeries[0][0]],
                ["MERS-CoV (" + MCTemp.ChartSeries[1][1] + "%)", MCTemp.ChartSeries[1][0]],
                ["DF (" + MCTemp.ChartSeries[2][1] + "%)", MCTemp.ChartSeries[2][0]],
                ["SARI (" + MCTemp.ChartSeries[3][1] + "%)", MCTemp.ChartSeries[3][0]],
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
    this.CompositeCharts['syndromesByFacility'] = new Chart(this.http);
    this.CompositeCharts['syndromesByFacility'].loadData(
      "syndromic_cases/syndromesByFacility",
      () => {
        let MCTemp = this.CompositeCharts['syndromesByFacility'];

        MCTemp.LoadChartOptions();
      },
      () => {
        let MCTemp = this.CompositeCharts['syndromesByFacility'];

        // Facility (Index --> 0)
        MCTemp.ChartSeries.push([]);

        // SARI (Index --> 1)
        MCTemp.ChartSeries.push([]);

        // UF (Index --> 2)
        MCTemp.ChartSeries.push([]);

        // DF (Index --> 3)
        MCTemp.ChartSeries.push([]);

        // MERS CoV (Index --> 4)
        MCTemp.ChartSeries.push([]);

        MCTemp.ChartData.forEach((dataInstance) => {
          MCTemp.ChartSeries[0].push(dataInstance.HealthFacility);
          MCTemp.ChartSeries[1].push(dataInstance.SARIPercentage);
          MCTemp.ChartSeries[2].push(dataInstance.UFPercentage);
          MCTemp.ChartSeries[3].push(dataInstance.DFPercentage);
          MCTemp.ChartSeries[4].push(dataInstance.MERSCovPercentage);
        });
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
            categories: MCTemp.ChartSeries[0],
            title: { text: '' },
          },
          yAxis: [
            {
              title: {
                text: 'Percent of Cases',
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
              data: MCTemp.ChartSeries[1],
              // color: '#234FEA',
            },
            {
              name: 'UF',
              data: MCTemp.ChartSeries[2],
              // color: '#FF0000',
            },
            {
              name: 'DF',
              data: MCTemp.ChartSeries[3],
              // color: '#008000',
            },
            {
              name: 'MERS-COV',
              data: MCTemp.ChartSeries[4],
              // color: '#FFA500',
            }
          ],
          credits: {
            enabled: false,
          }
        }
      }
    );
    //#endregion

    //#region Load Chart --> Syndromes over time
    this.CompositeCharts['syndromesOverTime'] = new Chart(this.http);
    this.CompositeCharts['syndromesOverTime'].loadData(
      "overview/syndromesOverTime",
      () => {
        let MCTemp = this.CompositeCharts['syndromesOverTime'];

        MCTemp.LoadChartOptions();
      },
      () => {
        let MCTemp = this.CompositeCharts['syndromesOverTime'];

        for (let index = 0; index < 6; index++) {
          MCTemp.ChartSeries.push([]);
        }

        MCTemp.ChartData.forEach((dataInstance) => {
          //Compile Epi Week (Index --> 0)
          MCTemp.ChartSeries[0].push(dataInstance.WeekNumber);

          //Compile SARI (Index --> 1)
          MCTemp.ChartSeries[1].push(dataInstance.SARINumber);

          //Compile UF (Index --> 2)
          MCTemp.ChartSeries[2].push(dataInstance.UFNumber);

          //Compile DF (Index --> 3)
          MCTemp.ChartSeries[3].push(dataInstance.DFNumber);

          //Compile MERS-Cov (Index --> 4)
          MCTemp.ChartSeries[4].push(dataInstance.MERSCovNumber);

          //Compile NonUFSARIDFMERSCVONumber (Index --> 5)
          MCTemp.ChartSeries[5].push(dataInstance.NonUFSARIDFMERSCVONumber);
        });
      },
      () => {
        let MCTemp = this.CompositeCharts['syndromesOverTime'];

        MCTemp.ChartOptions = {
          title: {
            text: 'Syndromes over time',
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
          yAxis: {
            title: {
              text: "Number tested or virus detected",
            }
          },
          series: [
            {
              showInLegend: true,
              name: "SARI",
              data: MCTemp.ChartSeries[1],
              type: 'spline',
              color: "#234FEA",
            },
            {
              showInLegend: true,
              name: "UF",
              data: MCTemp.ChartSeries[2],
              type: 'spline',
              color: "#FF0000",
            },
            {
              showInLegend: true,
              name: "DF",
              data: MCTemp.ChartSeries[3],
              type: 'spline',
              color: "#FF0000",
            },
            {
              showInLegend: true,
              name: "MERS-COV",
              data: MCTemp.ChartSeries[4],
              type: 'spline',
              color: "#FFA500",
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
