import { ReviewService } from '../../../services/mortality_ncov/service';
import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';

import { Covid19Summary } from '../../../models/mortality_ncov/covid19Summary.model';
import { Covid19Properties } from '../../../models/mortality_ncov/covid19Properties.model';

import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsSolidGauge from 'highcharts/modules/solid-gauge';

HighchartsMore(Highcharts);
HighchartsSolidGauge(Highcharts);

@Component({
  templateUrl: 'about.component.html',
  styleUrls: ['about.component.scss']
})

export class AboutComponent implements OnInit {
  //#region Prerequisites
  highcharts = Highcharts;
  //#endregion

  //#region Prerequisites --> COVID-19 Summary
  covid19Summary: Covid19Summary[] = [];
  covid19SummaryByMonth: Covid19Summary[] = [];

  covid19SummaryGroup: any[][] = [];
  covid19SummarySeries: any[] = [];
  covid19SummaryOptions: {} = {};
  //#endregion

  //#region Prerequisites --> COVID-19 Positivity Over Time
  covid19PositivityOvertime: Covid19Properties[] = [];
  covid19PositivityOvertimeSeries: any[][] = [];
  covid19PositivityOvertimeOptions: {} = {};
  //#endregion

  //#region Prerequisites --> COVID-19 Positivity by Age and Gender
  covidPositivityByAgeGender: Covid19Properties[] = [];
  covid19PositivityByAgeGenderSeries: any[][] = [];
  covid19PositivityByAgeGenderOptions: {} = {};
  //#endregion

  //#region Prerequisites --> COVID-19 Positivity By Facility
  covid19OverallPositivityByFacility: Covid19Properties[] = [];
  covid19OverallPositivityByFacilitySeries: any[][] = [];
  covid19OverallPositivityByFacilityChartOptions: {} = {};
  //#endregion

  //#region Prerequisites --> COVID-19 Cascade
  covid19Cascade: Covid19Properties[] = [];
  covid19CascadeSeries: any[] = [];
  covid19CascadeChartOptions: {} = {};
  //#endregion

  // constructor(private chartsData: OverviewChartsData) { }

  constructor(private reviewService: ReviewService) { }

  ngOnInit(): void {
    this.loadCovid19SummaryData();
    this.loadCovid19SummaryChart();

    this.loadCovid19CascadeData();
    this.loadCovid19CascadeChart();

    this.loadCovid19PositivityOvertimeData();
    this.loadCovid19PositivityOvertimeChart();

    this.loadCovid19PositivityByAgeGenderData();
    this.loadCovid19PositivityByAgeGenderChart();

    this.loadCovid19PositivityByFacilityData();
    this.loadCovid19PositivityByFacilityChart();
  }

  //#region Load Chart --> Covid-19 Summary
  loadCovid19SummaryData() {
    for (let index = 0; index < 5; index++) {
      //Init Group Instance
      this.covid19SummaryGroup.push([]);

      //Init Chart Series (Index --> 0)
      this.covid19SummaryGroup[index].push([]);

      //Init Chart Options (Index --> 1)
      this.covid19SummaryGroup[index].push({});

      //Init Previous Month Data (Index --> 2)
      this.covid19SummaryGroup[index].push(0);
    }

    this.reviewService.findSummary().subscribe((response) => {
      this.covid19Summary = response;

      //#region Push series data into array at specific indexes
      this.covid19SummaryGroup.forEach((groupInstance, index) => {
        switch (index) {
          //Total Screened Card
          case 0:
            // Total Screened Number (Index --> 0)
            this.covid19SummaryGroup[index][0].push(this.covid19Summary[0].TotalScreened);
            break;

          //Eligible Card
          case 1:
            // Eligible Number (Index --> 0)
            this.covid19SummaryGroup[index][0].push(this.covid19Summary[0].Eligible);

            // Eligible Percent (Index --> 1)
            this.covid19SummaryGroup[index][0].push(this.covid19Summary[0].PercentEligible);
            break;

          //Enrolled Card
          case 2:
            // Enrolled Number (Index --> 0)
            this.covid19SummaryGroup[index][0].push(this.covid19Summary[0].Enrolled);

            // Enrolled Percent (Index --> 1)
            this.covid19SummaryGroup[index][0].push(this.covid19Summary[0].PercentEnrolled);
            break;

          //Tested Card
          case 3:
            // Tested Number (Index --> 0)
            this.covid19SummaryGroup[index][0].push(this.covid19Summary[0].Tested);

            // Tested Percent (Index --> 1)
            this.covid19SummaryGroup[index][0].push(this.covid19Summary[0].PercentTested);
            break;

          //Positive Card
          case 4:
            // Positive Number (Index --> 0)
            this.covid19SummaryGroup[index][0].push(this.covid19Summary[0].Positive);

            // Positive Percent (Index --> 1)
            this.covid19SummaryGroup[index][0].push(this.covid19Summary[0].PercentPositive);
            break;

          default:
            break;
        }
      });
      //#endregion

      this.loadCovid19SummaryChart();
    });

    this.reviewService.findSummaryByMonth().subscribe((response) => {
      this.covid19SummaryByMonth = response;

      //#region Attach Summary --> Last Month Data
      this.covid19SummaryGroup.forEach((groupInstance, index) => {
        switch (index) {
          //Total Screened Card (Index --> 0)
          case 0:
            // Total Screened Number --> Last Month (Index --> 2)
            this.covid19SummaryGroup[index][2] = this.covid19SummaryByMonth[0].TotalScreenedLastMonth;
            break;

          //Eligible Card (Index --> 1)
          case 1:
            // Eligible Number --> Last Month (Index --> 0)
            this.covid19SummaryGroup[index][2] = this.covid19SummaryByMonth[0].EligibleLastMonth;
            break;

          //Enrolled Card (Index --> 2)
          case 2:
            // Enrolled Number --> Last Month (Index --> 0)
            this.covid19SummaryGroup[index][2] = this.covid19SummaryByMonth[0].EnrolledLastMonth;
            break;

          //Tested Card (Index --> 3)
          case 3:
            // Tested Number --> Last Month (Index --> 0)
            this.covid19SummaryGroup[index][2] = this.covid19SummaryByMonth[0].TestedLastMonth;
            break;

          //Positive Card (Index --> 4)
          case 4:
            // Positive Number --> Last Month (Index --> 0)
            this.covid19SummaryGroup[index][2] = this.covid19SummaryByMonth[0].PositiveLastMonth;
            break;

          default:
            break;
        }
      });
      //#endregion
    });
  }

  loadCovid19SummaryChart() {
    this.covid19SummaryGroup.forEach((groupInstance, index) => {
      //Attach Chart Options (Index --> 1)
      this.covid19SummaryGroup[index][1] = {
        chart: {
          type: 'solidgauge',
        },
        title: {
          text: '',
        },
        pane: {
          center: ['50%', '85%'],
          size: '100%',
          startAngle: -90,
          endAngle: 90,
          background: [
            {
              backgroundColor: '#EEE',
              innerRadius: '60%',
              outerRadius: '100%',
              shape: 'arc',
            },
          ],
        },
        exporting: {
          enabled: false,
        },
        tooltip: {
          enabled: false,
        },
        yAxis: {
          stops: [[1, '#234FEA']],
          lineWidth: 0,
          tickWidth: 0,
          minorTickInterval: null,
          tickAmount: 2,
          title: {
            y: -70,
          },
          labels: {
            enabled: false,
            y: 16,
          },
          min: 0,
          max: 100,
        },
        plotOptions: {
          solidgauge: {
            dataLabels: {
              y: -15,
              borderWidth: 0,
              useHTML: true,
              format: "<span style='color: #234FEA'>{y}%</span>"
            },
          },
        },
        series: [
          {
            name: 'Cascade',
            type: 'solidgauge',
            data: [groupInstance[0][1]],
            // plotOptions: {
            //   solidgauge: {
            //     dataLabels: {
            //       enabled: false
            //     }
            //   }
            // },
            tooltip: {
              valueSuffix: '',
            },
          }
        ],
        credits: {
          enabled: false,
        }
      }
    });

    HC_exporting(Highcharts);
  }
  //#endregion

  //#region Covid-19 Screening and Enrollment Cascade
  loadCovid19CascadeData() {
    this.reviewService.findCovid19Cascade().subscribe(
      response => {
        this.covid19Cascade = response;
        this.covid19CascadeSeries.push([]);
        this.covid19CascadeSeries[0].push(this.covid19Cascade[0].TotalScreened);
        this.covid19CascadeSeries[0].push(this.covid19Cascade[0].Eligible);
        this.covid19CascadeSeries[0].push(this.covid19Cascade[0].Enrolled);
        this.covid19CascadeSeries[0].push(this.covid19Cascade[0].Tested);
        this.covid19CascadeSeries[0].push(this.covid19Cascade[0].Positive);

        this.loadCovid19CascadeChart();
      });
  }

  loadCovid19CascadeChart() {
    this.covid19CascadeChartOptions = {
      title: {
        text: 'COVID-19 Screening and Enrolment Cascade',
        align: 'left'
      },
      chart: {
        type: 'column'
      },
      xAxis: {
        categories: ['Screened', 'Eligible', 'Enrolled', 'Tested', 'Positive'],
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
          borderWidth: 0
        }
      },
      series: [
        {
          color: "#234FEA",
          data: this.covid19CascadeSeries[0],
          showInLegend: false
        }
      ]
    };
  }
  //#endregion

  //#region Load Chart --> COVID-19 Positivity By Age and Gender
  loadCovid19PositivityByAgeGenderData() {
    this.reviewService
      .findCovid19PositivityByAgeGender()
      .subscribe((response) => {
        this.covidPositivityByAgeGender = response;

        //#region Init series indexes
        // Age Group(Index --> 0)
        this.covid19PositivityByAgeGenderSeries.push([]);
        this.covid19PositivityByAgeGenderSeries[0].push('0-4 Yrs');
        this.covid19PositivityByAgeGenderSeries[0].push('5-14 Yrs');
        this.covid19PositivityByAgeGenderSeries[0].push('15-34 Yrs');
        this.covid19PositivityByAgeGenderSeries[0].push('35-64 Yrs');
        this.covid19PositivityByAgeGenderSeries[0].push('65-84 Yrs');
        this.covid19PositivityByAgeGenderSeries[0].push('85+ Yrs');

        //Positivity - Female (Index --> 1)
        this.covid19PositivityByAgeGenderSeries.push([]);

        //Positivity - Male (Index --> 2)
        this.covid19PositivityByAgeGenderSeries.push([]);
        //#endregion

        //#region Push series data into array at specific indexes
        this.covid19PositivityByAgeGenderSeries[0].forEach(
          (ageGroupInstance) => {
            //Compile Female Positivity
            let female_found = false;
            let male_found = false;

            this.covidPositivityByAgeGender.forEach((dataInstance) => {
              if (dataInstance.AgeGroup == ageGroupInstance) {
                //Compile Female (Index --> 1)
                if (dataInstance.Gender == 'Female') {
                  this.covid19PositivityByAgeGenderSeries[1].push(
                    dataInstance.PositiveNumber
                  );
                  female_found = true;
                }

                //Compile Male (Index --> 2)
                else if (dataInstance.Gender == 'Male') {
                  this.covid19PositivityByAgeGenderSeries[2].push(dataInstance.PositiveNumber);
                  male_found = true;
                }
              }
            });

            if (!female_found) {
              this.covid19PositivityByAgeGenderSeries[1].push(0);
              console.log(ageGroupInstance, '!Female');
            }

            if (!male_found) {
              this.covid19PositivityByAgeGenderSeries[2].push(0);
              console.log(ageGroupInstance, '!Male');
            }
          }
        );
        //#endregion

        this.loadCovid19PositivityByAgeGenderChart();
      });
  }

  loadCovid19PositivityByAgeGenderChart() {
    this.covid19PositivityByAgeGenderOptions = {
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
          categories: this.covid19PositivityByAgeGenderSeries[0],
          title: { text: '' },
          reversed: false,
        },
        {
          categories: this.covid19PositivityByAgeGenderSeries[0],
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
            description: 'Percentage population',
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
          data: this.covid19PositivityByAgeGenderSeries[2],
          color: '#234FEA',
        },
        {
          name: 'Female',
          data: this.covid19PositivityByAgeGenderSeries[1],
          color: '#FC7500',
        }
      ]
    };
  }
  //#endregion

  //#region Load Chart --> Covid-19 Positivity by Facility
  loadCovid19PositivityByFacilityData() {
    this.reviewService.findCovid19OverallPositivityByFacility().subscribe(
      response => {
        this.covid19OverallPositivityByFacility = response;

        //#region Init series indexes
        // Facilities (Index --> 0)
        this.covid19OverallPositivityByFacilitySeries.push([]);

        //Enrolled (Index --> 1)
        this.covid19OverallPositivityByFacilitySeries.push([]);

        //Positive (Index --> 2)
        this.covid19OverallPositivityByFacilitySeries.push([]);
        //#endregion

        //#region Push series data into array at specific indexes
        this.covid19OverallPositivityByFacility.forEach(dataInstance => {
          //Compile Facilities (Index --> 0)
          this.covid19OverallPositivityByFacilitySeries[0].push(dataInstance.Facility);

          //Compile Enrollments (Index --> 1)
          this.covid19OverallPositivityByFacilitySeries[1].push(dataInstance.EnrolledNumber);

          //Compile Positives (Index --> 2)
          this.covid19OverallPositivityByFacilitySeries[2].push(dataInstance.Covid19Positive);
        });
        //#endregion

        this.loadCovid19PositivityByFacilityChart();
      });
  }

  loadCovid19PositivityByFacilityChart() {
    this.covid19OverallPositivityByFacilityChartOptions = {
      title: {
        text: 'Enrolled and Tested Positive by Facility',
        align: 'left'
      },
      chart: {
        type: "column",
      },
      xAxis: {
        categories: this.covid19OverallPositivityByFacilitySeries[0],
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
          data: this.covid19OverallPositivityByFacilitySeries[1],
          type: 'column',
          color: "#234FEA",
        },
        {
          showInLegend: true,
          name: "Positive",
          data: this.covid19OverallPositivityByFacilitySeries[2],
          type: 'column',
          color: "red",
          plotOptions: {
            column: {
              dataLabels: {
                enabled: true
              }
            }
          }
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

  //#region Load Chart --> COVID-19 Positivity Over Time
  loadCovid19PositivityOvertimeData() {
    this.reviewService.findCovidPositivityOvertime().subscribe((response) => {
      this.covid19PositivityOvertime = response;

      //#region Init series indexes
      //EpiWeek (Index --> 0)
      this.covid19PositivityOvertimeSeries.push([]);

      // SampleTested (Index --> 1)
      this.covid19PositivityOvertimeSeries.push([]);

      // CovidPositive (Index --> 2)
      this.covid19PositivityOvertimeSeries.push([]);
      //#endregion

      //#region Push series data into array at specific indexes
      this.covid19PositivityOvertime.forEach((dataInstance) => {
        this.covid19PositivityOvertimeSeries[0].push(dataInstance.EpiWeek);
        this.covid19PositivityOvertimeSeries[1].push(dataInstance.SampleTested);
        this.covid19PositivityOvertimeSeries[2].push(
          dataInstance.CovidPositive
        );
      });
      //#endregion

      this.loadCovid19PositivityOvertimeChart();
    });
  }

  loadCovid19PositivityOvertimeChart() {
    this.covid19PositivityOvertimeOptions = {
      chart: {
        // type: 'pie'
      },
      title: {
        text: 'COVID-19 Positivity over time',
        align: 'left',
      },
      xAxis: [
        {
          title: {
            text: '',
          },
          categories: this.covid19PositivityOvertimeSeries[0],
          crosshair: true
        }
      ],
      yAxis: [
        {
          // Primary yAxis
          labels: {
            format: '{value}',
            // style: {
            //     color: Highcharts.getOptions().colors[1]
            // }
          },
          title: {
            text: 'Number Tested',
            // style: {
            //     color: Highcharts.getOptions().colors[1]
            // }
          },
        },
        {
          // Secondary yAxis
          title: {
            text: 'Percent Positive',
            // style: {
            //     color: Highcharts.getOptions().colors[0]
            // }
          },
          labels: {
            // format: '{value}%',
            // style: {
            //     color: Highcharts.getOptions().colors[0]
            // }
          },
          opposite: true,
        }
      ],
      colors: ['#FF0000', 'green'],
      series: [
        {
          name: 'Sample Tested',
          type: 'column',
          color: '#234FEA',
          yAxis: 1,
          data: this.covid19PositivityOvertimeSeries[1],
        },
        {
          name: 'Positivity (%)',
          type: 'spline',
          color: 'red',
          accessibility: { point: { valueSuffix: '%' } },
          data: this.covid19PositivityOvertimeSeries[2],
        },
      ],
      plotOptions: {
        line: {
          stacking: 'normal',
          dataLabels: {
            enabled: true
          }
        }
      }
    };

    HC_exporting(Highcharts);
  }
  //#endregion

}
