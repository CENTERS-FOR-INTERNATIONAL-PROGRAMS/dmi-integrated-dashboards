import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Chart } from '../../../models/mortality_ncov/Chart.model';
import { ChartParent } from '../../../models/mortality_ncov/ChartParent.model';

import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';

import { APIReader } from 'src/app/models/APIReader.model';
import { IDFilter } from 'src/app/models/IDFilter.model';
import { IDFacility } from 'src/app/models/IDFacility.model';
import { GroupedCategory } from '../../../models/GroupedCategory.model';

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

        // Reset
        MCTemp.ChartSeries = [];

        MCTemp.ChartSeries.push([]);
        MCTemp.ChartSeries[0].push(MCTemp.ChartData[0].ScreenedNumber);
        MCTemp.ChartSeries[0].push(MCTemp.ChartData[0].EligibleNumber);
        MCTemp.ChartSeries[0].push(MCTemp.ChartData[0].EnrolledNumber);
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
              name: "Number",
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

        // Reset
        MCTemp.ChartSeries = [];

        //#region Init series indexes
        // Facilities (Index --> 0)
        MCTemp.ChartSeries.push([]);

        //Screened (Index --> 1)
        MCTemp.ChartSeries.push([]);

        //Eligible (Index --> 2)
        MCTemp.ChartSeries.push([]);
        //#endregion

        //#region Push series data into array at specific indexes
        MCTemp.ChartData.forEach(dataInstance => {
          //Compile Facilities
          MCTemp.ChartSeries[0].push(dataInstance.Facility);

          //Compile Screened
          MCTemp.ChartSeries[1].push(dataInstance.ScreenedNumber);

          //Compile Eligible
          MCTemp.ChartSeries[2].push(dataInstance.EligibleNumber);
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
              name: "Screened",
              data: MCTemp.ChartSeries[1],
              type: 'column',
              color: "#234FEA",
            },
            {
              showInLegend: true,
              name: "Eligible",
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

    //#region Load Chart --> Screening by over time
    this.CompositeCharts['findScreeningOvertime'] = new Chart(this.http);
    this.CompositeCharts['findScreeningOvertime'].loadData(
      "screening/findScreeningOvertime",
      () => {
        let MCTemp = this.CompositeCharts['findScreeningOvertime'];

        MCTemp.LoadChartOptions();
      },
      () => {
        let MCTemp = this.CompositeCharts['findScreeningOvertime'];
        let GCPeriod: GroupedCategory[] = [];
        let GCInstance = new GroupedCategory("", []);

        // Reset
        MCTemp.ChartSeries = [];

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
          MCTemp.ChartSeries[1].push(dataInstance.ScreenedNumber);

          let gc_year_index = GCInstance.attach(GCPeriod, dataInstance.Year, false);
          let gc_month_index = GCInstance.attach(GCPeriod[gc_year_index].categories, dataInstance.Month, false);
          let gc_epiweek_index = GCInstance.attach(GCPeriod[gc_year_index].categories[gc_month_index].categories, dataInstance.EpiWeek, true);
        });
        //#endregion
      
        //Period (Index --> 2)
        MCTemp.ChartSeries.push(JSON.parse(JSON.stringify(GCPeriod)));
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
            title: { text: "Period (Year, Month, Epi Week)" },
            tickWidth: 1,
            labels: {
              y: 18,
              groupedOptions: [{
                y: 10,
              }, {
                y: 10
              }]
            },
            categories: MCTemp.ChartSeries[2]
          },
          yAxis: {
            title: {
              text: "Number Screened",
            },
            allowDecimals: false
          },
          series: [
            {
              name: "Number Screened",
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
