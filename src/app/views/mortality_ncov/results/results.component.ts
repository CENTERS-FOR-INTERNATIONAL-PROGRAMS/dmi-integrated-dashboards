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
  templateUrl: 'results.component.html',
  styleUrls: ['results.component.scss']
})

export class ResultsComponent implements OnInit {
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
    //#region Load Chart --> COVID-19 Results by Status
    this.CompositeCharts['findByStatus'] = new Chart(this.http);
    this.CompositeCharts['findByStatus'].loadData(
      "results/findByStatus",
      () => {
        let MCTemp = this.CompositeCharts['findByStatus'];

        for (let i = 0; i < 2; i++) {
          MCTemp.ChartSeries.push([]);

          //Number (Index -> 0)
          MCTemp.ChartSeries[i].push(0);

          //Number (Percentage -> 1)
          MCTemp.ChartSeries[i].push(0);
        }

        MCTemp.LoadChartOptions();
      },
      () => {
        let MCTemp = this.CompositeCharts['findByStatus'];

        //#region Push series data into array at specific indexes
        // COVID-19 Positive (Index --> 0)
        MCTemp.ChartSeries[0][0] = MCTemp.ChartData[0].Covid19Positive;

        // COVID-19 Negative (Index --> 1)
        MCTemp.ChartSeries[1][0] = MCTemp.ChartData[0].Covid19Negative;
        //#endregion
      },
      () => {
        let MCTemp = this.CompositeCharts['findByStatus'];

        MCTemp.ChartOptions = {
          title: {
            text: 'Overall COVID-19 Positivity',
            align: 'left'
          },
          chart: {
            type: "pie",
          },
          colors: [
            "#234FEA",
            "#FFA500",
          ],
          series: [
            {
              name: "Data",
              type: 'pie',
              data: [
                ["Positive: " + MCTemp.ChartSeries[0][0], MCTemp.ChartSeries[0][0]],
                ["Negative: " + MCTemp.ChartSeries[1][0], MCTemp.ChartSeries[1][0]]
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

    //#region Load Chart --> COVID-19 Results by Facility
    this.CompositeCharts['findByFacility'] = new Chart(this.http);
    this.CompositeCharts['findByFacility'].loadData(
      "results/findByFacility",
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

        //Enrolled(Positive) (Index --> 2)
        MCTemp.ChartSeries.push([]);
        //#endregion

        //#region Push series data into array at specific indexes
        MCTemp.ChartData.forEach(dataInstance => {
          //Compile Facilities
          MCTemp.ChartSeries[0].push(dataInstance.Facility);

          //Compile Negative
          MCTemp.ChartSeries[1].push(dataInstance.Covid19Negative);

          //Compile Enrolled --> Positive
          MCTemp.ChartSeries[2].push(dataInstance.Covid19Positive);
        });
        //#endregion
      },
      () => {
        let MCTemp = this.CompositeCharts['findByFacility'];

        MCTemp.ChartOptions = {
          chart: {
            type: 'column'
          },
          title: {
            text: 'COVID-19 Results by Facility',
            align: 'left'
          },
          xAxis: {
            categories: MCTemp.ChartSeries[0]
          },
          yAxis: {
            min: 0,
            title: {
              text: 'Number Tested'
            },
            stackLabels: {
              enabled: false
            }
          },
          legend: {
            align: 'left',
            x: 70,
            verticalAlign: 'top',
            y: 70,
            floating: true
          },
          tooltip: {
            headerFormat: '<b>{point.x}</b><br/>',
            pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
          },
          plotOptions: {
            column: {
              stacking: 'normal',
              dataLabels: {
                enabled: true
              }
            }
          },
          series: [{
            name: 'Negative',
            data: MCTemp.ChartSeries[2],
            type: 'column',
            color: '#008000'
          }, {
            name: 'Positive',
            data: MCTemp.ChartSeries[1],
            type: 'column',
            color: '#FF0000'
          }],
          credits: {
            enabled: false,
          }
        }
      }
    );
    //#endregion

    //#region Load Chart --> COVID-19 Positivity by Age and Gender
    this.CompositeCharts['findByAgeGender'] = new Chart(this.http);
    this.CompositeCharts['findByAgeGender'].loadData(
      "results/findByAgeGender",
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
        MCTemp.ChartSeries[0].forEach((ageGroupInstance: any) => {
          //Compile Female Positivity
          let female_found = false;
          let male_found = false;

          MCTemp.ChartData.forEach(dataInstance => {
            if (dataInstance.AgeGroup == ageGroupInstance) {
              if (dataInstance.Gender == "Female") {
                MCTemp.ChartSeries[1].push(dataInstance.Covid19Positive);
                female_found = true;
              }

              //Compile Male Positivity
              else if (dataInstance.Gender == "Male") {
                MCTemp.ChartSeries[2].push(dataInstance.Covid19Positive);
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
            text: 'COVID-19 Positivity by Age Group and Gender',
            align: 'left',
          },
          chart: { type: "bar" },
          xAxis: {
            categories: MCTemp.ChartSeries[0],
            title: { text: "" },
          },
          yAxis: [
            {
              title: {
                text: "Number Positive"
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

    //#region Load Chart --> COVID-19 Results by Positivity Over Time
    this.CompositeCharts['findByPositivityOverTime'] = new Chart(this.http);
    this.CompositeCharts['findByPositivityOverTime'].loadData(
      "results/findByPositivityOverTime",
      () => {
        let MCTemp = this.CompositeCharts['findByPositivityOverTime'];

        MCTemp.LoadChartOptions();
      },
      () => {
        let MCTemp = this.CompositeCharts['findByPositivityOverTime'];

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

          //Compile SampleTested
          MCTemp.ChartSeries[1].push(dataInstance.SampleTested);

          //Compile COVID-19 Positive
          MCTemp.ChartSeries[2].push(dataInstance.Covid19Positive);
        });
        //#endregion
      },
      () => {
        let MCTemp = this.CompositeCharts['findByPositivityOverTime'];

        MCTemp.ChartOptions = {
          title: {
            text: 'COVID-19 Positivity over time',
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
              text: "Number Tested",
            }
          },
          {
            title: {
              text: 'Percent Positive',
            },
            opposite: true,
          }],
          series: [
            {
              name: "Sample Tested",
              data: MCTemp.ChartSeries[1],
              color: "#234FEA",
              type: "column"
            },
            {
              name: "Percent Positive",
              data: MCTemp.ChartSeries[2],
              color: "#FF0000",
              type: "spline",
              yAxis: 1
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