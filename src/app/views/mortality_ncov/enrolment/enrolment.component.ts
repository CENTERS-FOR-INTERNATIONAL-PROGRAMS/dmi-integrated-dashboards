import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Chart } from '../../../models/mortality_ncov/Chart.model';
import { ChartParent } from '../../../models/mortality_ncov/ChartParent.model';

import { APIReader } from 'src/app/models/APIReader.model';
import { IDFilter } from 'src/app/models/IDFilter.model';
import { IDFacility } from 'src/app/models/IDFacility.model';

import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';

@Component({
  templateUrl: 'enrolment.component.html',
  styleUrls: ['enrolment.component.scss']
})

export class EnrolmentComponent implements OnInit {
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
    //#region Load Chart --> Enrolment by Gender
    this.CompositeCharts['findByGender'] = new Chart(this.http);
    this.CompositeCharts['findByGender'].loadData(
      "enrolment/findByGender",
      () => {
        let MCTemp = this.CompositeCharts['findByGender'];

        MCTemp.LoadChartOptions();
      },
      () => {
        let MCTemp = this.CompositeCharts['findByGender'];

        //#region Push series data into array at specific indexes
        //Male Series (Index --> 0)
        MCTemp.ChartSeries.push([]);
        MCTemp.ChartSeries[0].push(MCTemp.ChartData[0].EnrolledMale);
        MCTemp.ChartSeries[0].push(MCTemp.ChartData[0].TestedMale);
        MCTemp.ChartSeries[0].push(MCTemp.ChartData[0].PositiveMale);

        //Female Series (Index --> 1)
        MCTemp.ChartSeries.push([]);
        MCTemp.ChartSeries[1].push(MCTemp.ChartData[0].EnrolledFemale);
        MCTemp.ChartSeries[1].push(MCTemp.ChartData[0].TestedFemale);
        MCTemp.ChartSeries[1].push(MCTemp.ChartData[0].PositiveFemale);
        //#endregion
      },
      () => {
        let MCTemp = this.CompositeCharts['findByGender'];

        MCTemp.ChartOptions = {
          title: {
            text: 'Enrolment by Gender',
            align: 'left'
          },
          chart: {
            type: 'column'
          },
          xAxis: {
            categories: ['Enrolled', 'Tested', 'Positive'],
            crosshair: true,
            accessibility: {
              description: 'Categories'
            }
          },
          yAxis: {
            min: 0,
            title: {
              text: 'Number Enrolled'
            }
          },
          tooltip: {
            valueSuffix: ''
          },
          plotOptions: {
            column: {
              pointPadding: 0.2,
              borderWidth: 0
            }
          },
          series: [
            {
              name: 'MALE',
              color: "#234FEA",
              data: MCTemp.ChartSeries[0]
            },
            {
              name: 'FEMALE',
              color: "#FFA500",
              data: MCTemp.ChartSeries[1]
            }
          ],
          credits: {
            enabled: false,
          }
        }
      }
    );
    //#endregion

    //#region Load Chart --> Enrolment by Age Group and Gender
    this.CompositeCharts['findByAgeGender'] = new Chart(this.http);
    this.CompositeCharts['findByAgeGender'].loadData(
      "enrolment/findByAgeGender",
      () => {
        let MCTemp = this.CompositeCharts['findByAgeGender'];

        MCTemp.LoadChartOptions();
      },
      () => {
        let MCTemp = this.CompositeCharts['findByAgeGender'];

        //#region Init series indexes
        // Age Group(Index --> 0)
        MCTemp.ChartSeries.push([]);
        MCTemp.ChartSeries[0].push("0-4 Yrs");
        MCTemp.ChartSeries[0].push("5-14 Yrs");
        MCTemp.ChartSeries[0].push("15-34 Yrs");
        MCTemp.ChartSeries[0].push("35-64 Yrs");
        MCTemp.ChartSeries[0].push("65-84 Yrs");
        MCTemp.ChartSeries[0].push("85+ Yrs");

        //Positivity - Female (Index --> 1)
        MCTemp.ChartSeries.push([]);

        //Positivity - Male (Index --> 2)
        MCTemp.ChartSeries.push([]);
        //#endregion

        //#region Push series data into array at specific indexes
        MCTemp.ChartSeries[0].forEach((ageGroupInstance: string) => {
          //Compile Female Positivity
          let female_found = false;
          let male_found = false;

          MCTemp.ChartData.forEach(dataInstance => {
            if (dataInstance.AgeGroup == ageGroupInstance) {
              //Compile Female (Index --> 1)
              if (dataInstance.Gender == "Female") {
                MCTemp.ChartSeries[1].push(dataInstance.EnrolledNumber);
                female_found = true;
              }

              //Compile Male (Index --> 2)
              else if (dataInstance.Gender == "Male") {
                MCTemp.ChartSeries[2].push(dataInstance.EnrolledNumber);
                male_found = true;
              }
            }
          });

          if (!female_found) {
            MCTemp.ChartSeries[1].push(0);
          }

          if (!male_found) {
            MCTemp.ChartSeries[2].push(0);
          }
        });
        //#endregion

      },
      () => {
        let MCTemp = this.CompositeCharts['findByAgeGender'];

        MCTemp.ChartOptions = {
          title: {
            text: 'Enrolment by Age Group and Gender',
            align: 'left',
          },
          chart: { type: "bar" },
          xAxis: [
            {
              categories: MCTemp.ChartSeries[0],
              title: { text: "" }
            }
          ],
          yAxis: [
            {
              title: {
                text: "Number Enrolled"
              }
            }
          ],
          plotOptions: { series: { stacking: "normal" }, bar: { pointWidth: 18 } },
          tooltip: {
          },
          legend: { align: "left", verticalAlign: "top", y: 0, x: 80 },
          series: [
            {
              name: "Male",
              data: MCTemp.ChartSeries[2],
              color: "#234FEA",
              type: 'bar'
            },
            {
              name: "Female",
              data: MCTemp.ChartSeries[1],
              color: "#FFA500",
              type: 'bar'
            }
          ],
          credits: {
            enabled: false,
          }
        }
      }
    );
    //#endregion

    //#region Load Chart --> Enrolment by Facility
    this.CompositeCharts['findByFacility'] = new Chart(this.http);
    this.CompositeCharts['findByFacility'].loadData(
      "enrolment/findByFacility",
      () => {
        let MCTemp = this.CompositeCharts['findByFacility'];

        MCTemp.LoadChartOptions();
      },
      () => {
        let MCTemp = this.CompositeCharts['findByFacility'];

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
          //Compile Facilities (Index --> 0)
          MCTemp.ChartSeries[0].push(dataInstance.Facility);

          //Compile Enrollments (Index --> 1)
          MCTemp.ChartSeries[1].push(dataInstance.EnrolledNumber);

          //Compile Positives (Index --> 2)
          MCTemp.ChartSeries[2].push(dataInstance.Covid19Positive);
        });
        //#endregion
      },
      () => {
        let MCTemp = this.CompositeCharts['findByFacility'];

        MCTemp.ChartOptions = {
          title: {
            text: 'Enrolment by Facility',
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
              text: "Number Enrolled",
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

    //#region Load Chart --> Enrolment by over time
    this.CompositeCharts['findOverTime'] = new Chart(this.http);
    this.CompositeCharts['findOverTime'].loadData(
      "enrolment/findOverTime",
      () => {
        let MCTemp = this.CompositeCharts['findOverTime'];

        MCTemp.LoadChartOptions();
      },
      () => {
        let MCTemp = this.CompositeCharts['findOverTime'];

        //#region Init series indexes
        // EpiWeek (Index --> 0)
        MCTemp.ChartSeries.push([]);

        //Elligible (Index --> 1)
        MCTemp.ChartSeries.push([]);

        //Enrolled (Index --> 2)
        MCTemp.ChartSeries.push([]);
        //#endregion

        //#region Push series data into array at specific indexes
        MCTemp.ChartData.forEach(dataInstance => {
          //Compile EpiWeek
          MCTemp.ChartSeries[0].push(dataInstance.EpiWeek);

          //Compile Elligible
          MCTemp.ChartSeries[1].push(dataInstance.ElligibleNumber);

          //Compile Enrolled
          MCTemp.ChartSeries[2].push(dataInstance.EnrolledNumber);
        });
        //#endregion
      },
      () => {
        let MCTemp = this.CompositeCharts['findOverTime'];

        MCTemp.ChartOptions = {
          title: {
            text: 'Enrolment over time',
            align: 'left'
          },
          xAxis: {
            categories: MCTemp.ChartSeries[0],
            title: {
              text: "Epiweek",
            }
          },
          yAxis: [{
            title: {
              text: "Number Eligible",
            }
          },
          {
            title: {
              text: 'Percent Enrolled',
            },
            opposite: true,
          }],
          series: [
            {
              name: "Elligible",
              data: MCTemp.ChartSeries[1],
              color: "#234FEA",
              type: "column"
            },
            {
              name: "Enrolled",
              data: MCTemp.ChartSeries[2],
              color: "red",
              yAxis: 1,
              type: "spline"
            }
          ],
          plotOptions: {
            column: {
              stacking: 'normal',
              dataLabels: {
                enabled: true
              }
            },
            spline: {
              stacking: 'normal',
              dataLabels: {
                enabled: true,
                useHTML: true,
                format: "{y}%"
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

    HC_exporting(Highcharts);
  }
}
