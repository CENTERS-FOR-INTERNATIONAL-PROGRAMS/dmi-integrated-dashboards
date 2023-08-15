import { ReviewService } from '../../../services/sari_ili/service';
import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { AFIProperties } from '../../../models/afi/AFIProperties.model';

import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsSolidGauge from 'highcharts/modules/solid-gauge';

HighchartsMore(Highcharts);
HighchartsSolidGauge(Highcharts);

@Component({
  templateUrl: 'overview.component.html',
  styleUrls: ['overview.component.scss']
})

export class AOverviewComponent implements OnInit {
  //#region Prerequisites
  highcharts = Highcharts;
  //#endregion

  //#region Prerequisites --> Enrolled by Gender
  AFIEnrolledByGender: AFIProperties[] = [];
  AFIEnrolledByGenderSeries: any[] = [];
  AFIEnrolledByGenderOptions: {} = {};
  //#endregion

  //#region Prerequisites --> Enrolled by AgeGroup Gender
  AFIEnrolledByAgeGender: AFIProperties[] = [];
  AFIEnrolledByAgeGenderSeries: any[] = [];
  AFIEnrolledByAgeGenderOptions: {} = {};
  //#endregion

  //#region Prerequisites --> Syndromes over time
  syndromesOvertime: AFIProperties[] = [];
  syndromesOvertimeSeries: any[] = [];
  syndromesOvertimeOptions: {} = {};
  //#endregion

  constructor(private reviewService: ReviewService) { }
  ngOnInit(): void {
    this.AFIEnrolledByGenderData();

    this.AFIEnrolledByAgeGenderData();

    this.syndromesOvertimeData();
  }

  //#region Load Chart --> Enrolled By Gender
  AFIEnrolledByGenderData() {
    // this.reviewService.findInfluenzaBDistribution().subscribe(
    //   response => {
    //     this.influenzaBLineageDistribution = response;

    //     //#region Push series data into array at specific indexes
    //     this.influenzaBLineageDistribution.forEach((dataInstance, index) => {
    //       this.influenzaBLineageDistributionSeries.push([]);

    //       //Compile Subtype (Index --> 0)
    //       this.influenzaBLineageDistributionSeries[index].push(dataInstance.Subtype);

    //       //Compile Percentage (Index --> 1)
    //       this.influenzaBLineageDistributionSeries[index].push(dataInstance.Percentage);

    //       //Compile Count (Index --> 2)
    //       this.influenzaBLineageDistributionSeries[index].push(dataInstance.Count);
    //     });
    //     //#endregion
    //   });

    this.AFIEnrolledByGenderChart();
  }

  AFIEnrolledByGenderChart() {
    this.AFIEnrolledByGenderOptions = {
      title: {
        text: 'Enrolled By Gender',
        align: 'left'
      },
      chart: {
        type: "pie",
      },
      colors: [
        "#FC7500",
        "#234FEA",
      ],
      series: [
        {
          name: "Data",
          type: 'pie',
          data: [
            ["Female", 7329],
            ["Male", 8894]
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
      }
    };
  }
  //#endregion

  //#region Load Chart --> Enrolled by Age Group and Gender
  AFIEnrolledByAgeGenderData() {
    // this.reviewService
    //   .findCovid19PositivityByAgeGender()
    //   .subscribe((response) => {
    //     this.AFIEnrolledByAgeGender = response;

    //     //#region Init series indexes
    //     // Age Group(Index --> 0)
    //     this.AFIEnrolledByAgeGenderSeries.push([]);
    //     this.AFIEnrolledByAgeGenderSeries[0].push('0-4 Yrs');
    //     this.AFIEnrolledByAgeGenderSeries[0].push('5-14 Yrs');
    //     this.AFIEnrolledByAgeGenderSeries[0].push('15-34 Yrs');
    //     this.AFIEnrolledByAgeGenderSeries[0].push('35-64 Yrs');
    //     this.AFIEnrolledByAgeGenderSeries[0].push('65-84 Yrs');
    //     this.AFIEnrolledByAgeGenderSeries[0].push('85+ Yrs');

    //     //Positivity - Female (Index --> 1)
    //     this.AFIEnrolledByAgeGenderSeries.push([]);

    //     //Positivity - Male (Index --> 2)
    //     this.AFIEnrolledByAgeGenderSeries.push([]);
    //     //#endregion

    //     //#region Push series data into array at specific indexes
    //     this.AFIEnrolledByAgeGenderSeries[0].forEach(
    //       (ageGroupInstance) => {
    //         //Compile Female Positivity
    //         let female_found = false;
    //         let male_found = false;

    //         this.AFIEnrolledByAgeGender.forEach((dataInstance) => {
    //           if (dataInstance.AgeGroup == ageGroupInstance) {
    //             //Compile Female (Index --> 1)
    //             if (dataInstance.Gender == 'Female') {
    //               this.AFIEnrolledByAgeGenderSeries[1].push(
    //                 dataInstance.PositiveNumber
    //               );
    //               female_found = true;
    //             }

    //             //Compile Male (Index --> 2)
    //             else if (dataInstance.Gender == 'Male') {
    //               this.AFIEnrolledByAgeGenderSeries[2].push(dataInstance.PositiveNumber * -1);
    //               male_found = true;
    //             }
    //           }
    //         });

    //         if (!female_found) {
    //           this.AFIEnrolledByAgeGenderSeries[1].push(0);
    //           console.log(ageGroupInstance, '!Female');
    //         }

    //         if (!male_found) {
    //           this.AFIEnrolledByAgeGenderSeries[2].push(0);
    //           console.log(ageGroupInstance, '!Male');
    //         }
    //       }
    //     );
    //     //#endregion

    //     this.loadCovid19PositivityByAgeGenderChart();
    //   });

    this.AFIEnrolledByAgeGenderChart();
  }

  AFIEnrolledByAgeGenderChart() {
    this.AFIEnrolledByAgeGenderOptions = {
      title: {
        text: 'COVID-19 Positivity by Age Group and Gender',
        align: 'left',
      },
      chart: {
        type: 'bar',
      },
      accessibility: {
        point: {
          valueDescriptionFormat: '{index}. Age {xDescription}, {value}%.',
        },
      },
      xAxis: [
        {
          categories: ["0-4 Yrs", "5-14 Yrs", "15-34 Yrs", "35-64 Yrs", "65-84 Yrs", "85+ Yrs"],
          // categories: this.AFIEnrolledByAgeGenderSeries[0],
          title: { text: '' },
          reversed: false,
        },
        {
          categories: ["0-4 Yrs", "5-14 Yrs", "15-34 Yrs", "35-64 Yrs", "65-84 Yrs", "85+ Yrs"],
          // categories: this.AFIEnrolledByAgeGenderSeries[0],
          title: { text: '' },
          reversed: false,
          opposite: true,
          linkedTo: 0,
        }
      ],
      yAxis: [
        {
          title: {
            text: 'Number Positive',
          },
          labels: {
            format: '{value}', //TODO! Format to remove netagive values
          },
          accessibility: {
            description: 'Number',
            rangeDescription: 'Range: 0 to 5%',
          }
        },
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
          '<b>{series.name}, age {point.category}</b><br/>' +
          'Population: {(abs point.y):.1f}%',
      },
      legend: { align: 'left', verticalAlign: 'top', y: 0, x: 80 },
      series: [
        {
          name: 'Male',
          data: [10, 30, 39, 40, 38, 39],
          // data: this.AFIEnrolledByAgeGenderSeries[2],
          color: '#234FEA',
        },
        {
          name: 'Female',
          data: [10, 30, 39, 40, 38, 39],
          // data: this.AFIEnrolledByAgeGenderSeries[1],
          color: '#FC7500',
        }
      ]
    };
  }
  //#endregion

  //#region Load Chart --> Syndromes over time
  syndromesOvertimeData() {
    // this.reviewService.findInfluenzaBDistribution().subscribe(
    //   response => {
    //     this.influenzaBLineageDistribution = response;

    //     //#region Push series data into array at specific indexes
    //     this.influenzaBLineageDistribution.forEach((dataInstance, index) => {
    //       this.influenzaBLineageDistributionSeries.push([]);

    //       //Compile Subtype (Index --> 0)
    //       this.influenzaBLineageDistributionSeries[index].push(dataInstance.Subtype);

    //       //Compile Percentage (Index --> 1)
    //       this.influenzaBLineageDistributionSeries[index].push(dataInstance.Percentage);

    //       //Compile Count (Index --> 2)
    //       this.influenzaBLineageDistributionSeries[index].push(dataInstance.Count);
    //     });
    //     //#endregion
    //   });

    this.syndromesOvertimeChart();
  }

  syndromesOvertimeChart() {
    this.syndromesOvertimeOptions = {
      title: {
        text: 'Syndromes over time',
        align: 'left'
      },
      chart: {
        type: "column",
      },
      xAxis: {
        categories: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], //Period
        title: false
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
          data: [1, 0, 12, 3, 21, 45, 12, 45, 32, 23, 23, 72],
          type: 'line',
          color: "#234FEA",
        },
        {
          showInLegend: true,
          name: "UF",
          data: [10, 32, 32, 56, 21, 32, 27, 62, 12, 13, 23, 23],
          type: 'line',
          color: "#FF0000",
        },
        {
          showInLegend: true,
          name: "DF",
          data: [12, 34, 42, 12, 11, 15, 13, 42, 31, 42, 12, 26],
          type: 'line',
          color: "#FF0000",
        },
        {
          showInLegend: true,
          name: "MERS-COV",
          data: [19, 3, 34, 33, 45, 44, 33, 42, 42, 55, 33, 42],
          type: 'line',
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
      }
    };
  }
  //#endregion
}
