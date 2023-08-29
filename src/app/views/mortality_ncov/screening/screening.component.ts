import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Chart } from '../../../models/mortality_ncov/Chart.model';
import { ChartParent } from '../../../models/mortality_ncov/ChartParent.model';

import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsSolidGauge from 'highcharts/modules/solid-gauge';
import { APIReader } from 'src/app/models/APIReader.model';
import { IDFilter } from 'src/app/models/IDFilter.model';
import { IDFacility } from 'src/app/models/IDFacility.model';

HighchartsMore(Highcharts);
HighchartsSolidGauge(Highcharts);

@Component({
  templateUrl: 'screening.component.html',
  styleUrls: ['screening.component.scss']
})

export class ScreeningComponent implements OnInit {
  //#region Prerequisites
  highcharts = Highcharts;
  CompositeCharts: ChartParent = {};

  APIReaderInstance = new APIReader(this.http);
  DataFilterInstance = new IDFilter();
  CompositeFacilities: any[] = [];
  //#endregion

  constructor(private http: HttpClient) { }
  ngOnInit(): void {
    this.loadFilters();
    this.loadCharts();
  }

  formatLabel(value: number): string {
    return `${value}`;
  }

  loadFilters() {
    //#region Acqurie composite facilities
    this.APIReaderInstance.loadData("mortality_ncov/acquireCompositeFacilities", () => {
      this.APIReaderInstance.CompositeData.forEach((dataInstance: any) => {
        this.CompositeFacilities.push(new IDFacility(dataInstance));
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
    //#region Load Chart --> Screening Cascade
    this.CompositeCharts['screeningCascade'] = new Chart(this.http);
    this.CompositeCharts['screeningCascade'].loadData(
      "screening/findCascade",
      () => {
        let MCTemp = this.CompositeCharts['screeningCascade'];

        MCTemp.LoadChartOptions();
      },
      () => {
        let MCTemp = this.CompositeCharts['screeningCascade'];
        MCTemp.ChartSeries.push([]);
        MCTemp.ChartSeries[0].push(MCTemp.ChartData[0].TotalScreened);
        MCTemp.ChartSeries[0].push(MCTemp.ChartData[0].Eligible);
        MCTemp.ChartSeries[0].push(MCTemp.ChartData[0].Enrolled);
      },
      () => {
        let MCTemp = this.CompositeCharts['screeningCascade'];

        MCTemp.ChartOptions = {
          title: {
            text: 'Screening Cascade',
            align: 'left'
          },
          chart: {
            type: 'column'
          },
          xAxis: {
            categories: ['Screened', 'Elligible', 'Enrolled'],
            crosshair: true,
            accessibility: {
              description: 'Categories'
            }
          },
          yAxis: {
            min: 0,
            title: {
              text: 'Number Screened'
            }
          },
          tooltip: {
            valueSuffix: ''
          },
          plotOptions: {
            column: {
              pointPadding: 0.2,
              borderWidth: 0,
              dataLabels: {
                enabled: true
              }
            }
          },
          series: [
            {
              data: MCTemp.ChartSeries[0],
              color: "#234FEA",
              showInLegend: false
            }
          ],
          credits: {
            enabled: false,
          }
        }
      }
    );
    //#endregion

    //#region Load Chart --> Screening by Facility
    this.CompositeCharts['findScreeningByFacility'] = new Chart(this.http);
    this.CompositeCharts['findScreeningByFacility'].loadData(
      "screening/findScreeningByFacility",
      () => {
        let MCTemp = this.CompositeCharts['findScreeningByFacility'];

        MCTemp.LoadChartOptions();
      },
      () => {
        let MCTemp = this.CompositeCharts['findScreeningByFacility'];

        //#region Init series indexes
        // Facilities (Index --> 0)
        MCTemp.ChartSeries.push([]);

        //Enrolled (Index --> 1)
        MCTemp.ChartSeries.push([]);

        //Positive (Index --> 2)
        MCTemp.ChartSeries.push([]);
        //#endregion

        //#region Push series data into array at specific indexes
        MCTemp.ChartData.forEach(dataInstance => {
          //Compile Facilities
          MCTemp.ChartSeries[0].push(dataInstance.Facility);

          //Compile Enrollments
          MCTemp.ChartSeries[1].push(dataInstance.Enrolled);

          //Compile Positives
          MCTemp.ChartSeries[2].push(dataInstance.Covid19Positive);
        });
        //#endregion
      },
      () => {
        let MCTemp = this.CompositeCharts['findScreeningByFacility'];

        MCTemp.ChartOptions = {
          title: {
            text: 'Screening by Facility',
            align: 'left'
          },
          chart: {
            type: "column",
          },
          xAxis: {
            categories: MCTemp.ChartSeries[0],
            title: false
          },
          yAxis: {
            title: {
              text: "Number Screened",
            }
          },
          series: [
            {
              showInLegend: true,
              name: "Enrolled",
              data: MCTemp.ChartSeries[1],
              type: 'column',
              color: "#234FEA",
            },
            {
              showInLegend: true,
              name: "Positive",
              data: MCTemp.ChartSeries[2],
              type: 'column',
              color: "red",
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
          credits: {
            enabled: false,
          }
        }
      }
    );
    //#endregion

    //#region Load Chart --> Screening by Overtime
    this.CompositeCharts['findScreeningOvertime'] = new Chart(this.http);
    this.CompositeCharts['findScreeningOvertime'].loadData(
      "screening/findScreeningOvertime",
      () => {
        let MCTemp = this.CompositeCharts['findScreeningOvertime'];

        MCTemp.LoadChartOptions();
      },
      () => {
        let MCTemp = this.CompositeCharts['findScreeningOvertime'];

        //#region Init series indexes
        // EpiWeek (Index --> 0)
        MCTemp.ChartSeries.push([]);

        //Enrolled (Index --> 1)
        MCTemp.ChartSeries.push([]);
        //#endregion

        //#region Push series data into array at specific indexes
        MCTemp.ChartData.forEach(dataInstance => {
          //Compile EpiWeek
          MCTemp.ChartSeries[0].push(dataInstance.EpiWeek);

          //Compile Screenings
          MCTemp.ChartSeries[1].push(dataInstance.Screened);
        });
        //#endregion
      },
      () => {
        let MCTemp = this.CompositeCharts['findScreeningOvertime'];

        MCTemp.ChartOptions = {
          title: {
            text: 'Screening over time',
            align: 'left'
          },
          chart: {
            type: "spline"
          },
          xAxis: {
            categories: MCTemp.ChartSeries[0],
          },
          yAxis: {
            title: {
              text: "Number Screened",
            }
          },
          series: [
            {
              name: "Epiweek",
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
              '{series.name}: {x}, Screened: {y}'
          },
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
