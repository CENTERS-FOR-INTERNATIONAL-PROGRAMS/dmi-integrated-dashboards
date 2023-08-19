import { ReviewService } from '../../../services/mortality_ncov/service';
import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Covid19Properties } from '../../../models/mortality_ncov/covid19Properties.model';

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

export class ResultsComponent implements OnInit {
  //#region Prerequisites
  highcharts = Highcharts;
  //#endregion

  //#region Prerequisites --> Covid-19 Results by Status
  covid19ResultsByStatus: Covid19Properties[] = [];
  covid19ResultsByStatusSeries: any[] = [];
  covid19ResultsByStatusOptions: {} = {};
  //#endregion

  //#region Prerequisites --> Covid-19 Results by Facility
  covid19ResultsByFacility: Covid19Properties[] = [];
  covid19ResultsByFacilitySeries: any[][] = [];
  covid19ResultsByFacilityOptions: {} = {};
  //#endregion

  //#region Prerequisites --> Covid-19 by Age and Gender
  resultsByAgeGender: Covid19Properties[] = [];
  resultsByAgeGenderSeries: any[][] = [];
  resultsByAgeGenderOptions: {} = {};
  //#endregion

  //#region Prerequisites --> Covid-19 by Positivity Over Time 
  resultsByPositivityOverTime: Covid19Properties[] = [];
  resultsByPositivityOverTimeSeries: any[][] = [];
  resultsByPositivityOverTimeOptions: {} = {};
  //#endregion

  constructor(private reviewService: ReviewService) { }
  ngOnInit(): void {
    this.loadCovid19ResultsByStatusData();
    this.loadCovid19ResultsByStatusChart();

    this.loadCovid19ResultsByFacilityData();
    this.loadCovid19ResultsByFacilityChart();

    this.loadCovid19ResultsByAgeGenderData();
    this.loadCovid19ResultsByAgeGenderChart();

    this.loadCovid19ResultsByPositivityOverTimeData();
    this.loadCovid19ResultsByPositivityOverTimeChart();
  }

  //#region Load Chart --> Covid-19 Results by Status
  loadCovid19ResultsByStatusData() {
    this.reviewService.findCovid19ResultsByStatus().subscribe(
      response => {
        this.covid19ResultsByStatus = response;

        //#region Push series data into array at specific indexes
        this.covid19ResultsByStatus.forEach(dataInstance => {
          // Covid-19 Positive (Index --> 0)
          this.covid19ResultsByStatusSeries.push(dataInstance.Covid19Positive);

          // Covid-19 Negative (Index --> 1)
          this.covid19ResultsByStatusSeries.push(dataInstance.Covid19Negative);
        });
        //#endregion

        this.loadCovid19ResultsByStatusChart();
      });
  }

  loadCovid19ResultsByStatusChart() {
    this.covid19ResultsByStatusOptions = {
      title: {
        text: 'Overall COVID-19 Positivity',
        align: 'left'
      },
      chart: {
        type: "pie",
      },
      colors: [
        "#234FEA", // Color for Category 2
        "#FC7500", // Color for Category 3
      ],
      series: [
        {
          name: "Data",
          type: 'pie',
          data: [
            ["Positive: " + this.covid19ResultsByStatusSeries[0], this.covid19ResultsByStatusSeries[0]],
            ["Negative: " + this.covid19ResultsByStatusSeries[1], this.covid19ResultsByStatusSeries[1]]
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
    };

    HC_exporting(Highcharts);
  }
  //#endregion

  //#region Load Chart --> Covid-19 Results by Facility
  loadCovid19ResultsByFacilityData() {
    this.reviewService.findCovid19ResultsByFacility().subscribe(
      response => {
        this.covid19ResultsByFacility = response;

        //#region Init series indexes
        // Facilities (Index --> 0)
        this.covid19ResultsByFacilitySeries.push([]);

        //Enrolled (Index --> 1)
        this.covid19ResultsByFacilitySeries.push([]);

        //Enrolled(Positive) (Index --> 2)
        this.covid19ResultsByFacilitySeries.push([]);
        //#endregion

        //#region Push series data into array at specific indexes
        this.covid19ResultsByFacility.forEach(dataInstance => {
          //Compile Facilities
          this.covid19ResultsByFacilitySeries[0].push(dataInstance.Facility);

          //Compile Negative
          this.covid19ResultsByFacilitySeries[1].push(dataInstance.Covid19Negative);

          //Compile Enrolled --> Positive
          this.covid19ResultsByFacilitySeries[2].push(dataInstance.Covid19Positive);
        });
        //#endregion

        this.loadCovid19ResultsByFacilityChart();
      });
  }

  loadCovid19ResultsByFacilityChart() {
    this.covid19ResultsByFacilityOptions = {
      chart: {
        type: 'column'
      },
      title: {
        text: 'COVID-19 Results by Facility',
        align: 'left'
      },
      xAxis: {
        categories: this.covid19ResultsByFacilitySeries[0]
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
        data: this.covid19ResultsByFacilitySeries[2],
        type: 'column',
        color: '#008000'
      }, {
        name: 'Positive',
        data: this.covid19ResultsByFacilitySeries[1],
        type: 'column',
        color: '#FF0000'
      }],
      credits: {
        enabled: false,
      }
    };

    HC_exporting(Highcharts);
  }
  //#endregion

  //#region Load Chart --> Covid-19 Positivity by Age and Gender
  loadCovid19ResultsByAgeGenderData() {
    this.reviewService.findCovid19ResultsByAgeGender().subscribe(
      response => {
        this.resultsByAgeGender = response;

        //#region Init series indexes
        // Age Group(Index --> 0)
        this.resultsByAgeGenderSeries.push([]);
        this.resultsByAgeGenderSeries[0].push("0-4 Yrs");
        this.resultsByAgeGenderSeries[0].push("5-14 Yrs");
        this.resultsByAgeGenderSeries[0].push("15-34 Yrs");
        this.resultsByAgeGenderSeries[0].push("35-64 Yrs");
        this.resultsByAgeGenderSeries[0].push("65-84 Yrs");
        this.resultsByAgeGenderSeries[0].push("85+ Yrs");

        //Positivity - Female (Index --> 1)
        this.resultsByAgeGenderSeries.push([]);

        //Positivity - Male (Index --> 2)
        this.resultsByAgeGenderSeries.push([]);
        //#endregion

        //#region Push series data into array at specific indexes
        this.resultsByAgeGenderSeries[0].forEach(ageGroupInstance => {
          //Compile Female Positivity
          let female_found = false;
          let male_found = false;

          this.resultsByAgeGender.forEach(dataInstance => {
            if (dataInstance.AgeGroup == ageGroupInstance) {
              if (dataInstance.Gender == "Female") {
                this.resultsByAgeGenderSeries[1].push(dataInstance.Covid19Positive);
                female_found = true;
              }

              //Compile Male Positivity
              else if (dataInstance.Gender == "Male") {
                this.resultsByAgeGenderSeries[2].push(dataInstance.Covid19Positive);
                male_found = true;
              }
            }
          });

          if (!female_found) {
            this.resultsByAgeGenderSeries[1].push(0);
            console.log(ageGroupInstance, "!Female");
          }

          if (!male_found) {
            this.resultsByAgeGenderSeries[2].push(0);
            console.log(ageGroupInstance, "!Male");
          }
        });
        //#endregion

        this.loadCovid19ResultsByAgeGenderChart();
      });
  }

  loadCovid19ResultsByAgeGenderChart() {
    this.resultsByAgeGenderOptions = {
      title: {
        text: 'COVID-19 Positivity by Age Group and Gender',
        align: 'left',
      },
      chart: { type: "bar" },
      xAxis: {
        categories: this.resultsByAgeGenderSeries[0],
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
          data: this.resultsByAgeGenderSeries[2],
          color: "#234FEA",
          type: 'bar'
        },
        {
          name: "Female",
          data: this.resultsByAgeGenderSeries[1],
          color: "#FC7500",
          type: 'bar'
        }
      ],
      credits: {
        enabled: false,
      }
    };

    HC_exporting(Highcharts);
  }
  //#endregion

  //#region Load Chart --> Covid-19 Results by Positivity Over Time
  loadCovid19ResultsByPositivityOverTimeData() {
    this.reviewService.findCovid19ResultsByPositivityOverTime().subscribe(
      response => {
        this.resultsByPositivityOverTime = response;

        //#region Init series indexes
        // EpiWeek (Index --> 0)
        this.resultsByPositivityOverTimeSeries.push([]);

        //Elligible (Index --> 1)
        this.resultsByPositivityOverTimeSeries.push([]);

        //Enrolled (Index --> 2)
        this.resultsByPositivityOverTimeSeries.push([]);
        //#endregion

        //#region Push series data into array at specific indexes
        this.resultsByPositivityOverTime.forEach(dataInstance => {
          console.log(dataInstance);

          //Compile EpiWeek
          this.resultsByPositivityOverTimeSeries[0].push(dataInstance.EpiWeek);

          //Compile SampleTested
          this.resultsByPositivityOverTimeSeries[1].push(dataInstance.SampleTested);

          //Compile Covid-19 Positive
          this.resultsByPositivityOverTimeSeries[2].push(dataInstance.Covid19Positive);
        });
        //#endregion

        this.loadCovid19ResultsByPositivityOverTimeChart();
      });
  }

  loadCovid19ResultsByPositivityOverTimeChart() {
    this.resultsByPositivityOverTimeOptions = {
      title: {
        text: 'COVID-19 Positivity over time',
        align: 'left'
      },
      chart: {
        // type: "line"
      },
      xAxis: {
        categories: this.resultsByPositivityOverTimeSeries[0],
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
          data: this.resultsByPositivityOverTimeSeries[1],
          color: "#234FEA",
          type: "column"
        },
        {
          name: "Percent Positive",
          data: this.resultsByPositivityOverTimeSeries[2],
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
    };

    HC_exporting(Highcharts);
  }
  //#endregion

}
