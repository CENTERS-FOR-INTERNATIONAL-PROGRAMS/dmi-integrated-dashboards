import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AFIChart } from '../../../models/afi/AFIChart.model';
import { ACParent } from '../../../models/afi/ACParent.model';

import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsSolidGauge from 'highcharts/modules/solid-gauge';
import HighchartsMap from "highcharts/modules/map"
import topography from '../../../data/world.geojson.json'
import topographyData from '../../../data/afi_pathogen_facility.json'

HighchartsMore(Highcharts);
HighchartsSolidGauge(Highcharts);
HighchartsMap(Highcharts);

@Component({
  templateUrl: 'overview.component.html',
  styleUrls: ['overview.component.scss']
})

export class AOverviewComponent implements OnInit {
  //#region Prerequisites
  CompositeCharts: ACParent = {};
  highcharts = Highcharts;
  //#endregion

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadCharts();
  }

  loadCharts() {

    //#region Load Chart --> Enrolled by gender
    this.CompositeCharts['enrolledByGender'] = new AFIChart(this.http);
    this.CompositeCharts['enrolledByGender'].loadData(
      "overview/enrolledByGender",
      () => {
        let MCTemp = this.CompositeCharts['enrolledByGender'];

        for (let index = 0; index < 2; index++) {
          MCTemp.ChartSeries.push([]);
          MCTemp.ChartSeries[index].push(Math.floor(Math.random() * 1000));
          MCTemp.ChartSeries[index].push(0);
        }

        MCTemp.LoadChartOptions();
      },
      () => {
        let MCTemp = this.CompositeCharts['enrolledByGender'];

        // Female Data (Index --> 0)
        MCTemp.ChartSeries[0][0] = MCTemp.ChartData[0].FemaleEnrolledNumber;
        MCTemp.ChartSeries[0][1] = MCTemp.ChartData[0].FemaleEnrolledPercentage;
        
        // Male Data (Index --> 1)
        MCTemp.ChartSeries[1][0] = MCTemp.ChartData[0].MaleEnrolledNumber;
        MCTemp.ChartSeries[1][1] = MCTemp.ChartData[0].MaleEnrolledPercentage;
      },
      () => {
        let MCTemp = this.CompositeCharts['enrolledByGender'];

        MCTemp.ChartOptions = {
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
                ["Female (" + MCTemp.ChartSeries[0][1] + "%)", MCTemp.ChartSeries[0][0]],
                ["Male (" + MCTemp.ChartSeries[1][1] + "%)", MCTemp.ChartSeries[1][0]]
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

    //#region Load Chart --> Enrolled by age and gender
    this.CompositeCharts['enrolledByAgeGender'] = new AFIChart(this.http);
    this.CompositeCharts['enrolledByAgeGender'].loadData(
      "overview/enrolledByAgeGender",
      () => {
        let MCTemp = this.CompositeCharts['enrolledByAgeGender'];

        MCTemp.LoadChartOptions();
      },
      () => {
        let MCTemp = this.CompositeCharts['enrolledByAgeGender'];

        //#region Init series indexes
        // Age Group(Index --> 0)
        MCTemp.ChartSeries.push([]);
        MCTemp.ChartSeries[0].push('0-4Yrs');
        MCTemp.ChartSeries[0].push('5-14Yrs');
        MCTemp.ChartSeries[0].push('15-34Yrs');
        MCTemp.ChartSeries[0].push('35-64Yrs');
        MCTemp.ChartSeries[0].push('65-84Yrs');
        MCTemp.ChartSeries[0].push('85+Yrs');

        //Positivity - Female (Index --> 1)
        MCTemp.ChartSeries.push([]);

        //Positivity - Male (Index --> 2)
        MCTemp.ChartSeries.push([]);
        //#endregion

        //#region Push series data into array at specific indexes
        MCTemp.ChartSeries[0].forEach(
          (ageGroupInstance: string) => {
            //Compile Female Positivity
            let female_found = false;
            let male_found = false;

            MCTemp.ChartData.forEach((dataInstance) => {
              if (dataInstance.AgeGroup == ageGroupInstance) {
                //Compile Female (Index --> 1)
                if (dataInstance.Gender == 'Female') {
                  MCTemp.ChartSeries[1].push(
                    dataInstance.EnrolledNumber
                  );
                  female_found = true;
                }

                //Compile Male (Index --> 2)
                else if (dataInstance.Gender == 'Male') {
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
          }
        );
        //#endregion

        console.log(MCTemp.ChartSeries);
      },
      () => {
        let MCTemp = this.CompositeCharts['enrolledByAgeGender'];

        MCTemp.ChartOptions = {
          title: {
            text: 'Enrolled by Age and Gender',
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
              categories: MCTemp.ChartSeries[0],
              title: { text: '' },
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
              '<b>{series.name}, {point.category}, {y}</b>'
          },
          legend: { align: 'left', verticalAlign: 'top', y: 0, x: 80 },
          series: [
            {
              name: 'Male',
              data: MCTemp.ChartSeries[1],
              color: '#234FEA',
            },
            {
              name: 'Female',
              data: MCTemp.ChartSeries[2],
              color: '#FC7500',
            }
          ],
          credits: {
            enabled: false,
          }
        }
      }
    );
    //#endregion

    //#region Load Chart --> Screened over time
    this.CompositeCharts['screenedOverTime'] = new AFIChart(this.http);
    this.CompositeCharts['screenedOverTime'].loadData(
      "overview/screenedOverTime",
      () => {
        let MCTemp = this.CompositeCharts['screenedOverTime'];

        for (let index = 0; index < 2; index++) {
          MCTemp.ChartSeries.push([]);

          for (let j = 0; j < 6; j++) {
            MCTemp.ChartSeries[index].push(Math.floor(Math.random() * 50));
          }
        }

        MCTemp.LoadChartOptions();
      },
      () => {
        let MCTemp = this.CompositeCharts['screenedOverTime'];
      },
      () => {
        let MCTemp = this.CompositeCharts['screenedOverTime'];

        MCTemp.ChartOptions = {
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
              type: 'spline',
              color: "#234FEA",
            },
            {
              showInLegend: true,
              name: "UF",
              data: [10, 32, 32, 56, 21, 32, 27, 62, 12, 13, 23, 23],
              type: 'spline',
              color: "#FF0000",
            },
            {
              showInLegend: true,
              name: "DF",
              data: [12, 34, 42, 12, 11, 15, 13, 42, 31, 42, 12, 26],
              type: 'spline',
              color: "#FF0000",
            },
            {
              showInLegend: true,
              name: "MERS-COV",
              data: [19, 3, 34, 33, 45, 44, 33, 42, 42, 55, 33, 42],
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
          credits: {
            enabled: false,
          }
        }
      }
    );
    //#endregion

    //#region Load Chart --> RDT Results Malaria
    this.CompositeCharts['RTDResultsMalaria'] = new AFIChart(this.http);
    this.CompositeCharts['RTDResultsMalaria'].loadData(
      "overview/RTDResultsMalaria",
      () => {
        let MCTemp = this.CompositeCharts['RTDResultsMalaria'];

        for (let index = 0; index < 2; index++) {
          MCTemp.ChartSeries.push([]);
          MCTemp.ChartSeries[index].push(Math.floor(Math.random() * 1000));
          MCTemp.ChartSeries[index].push(0);
        }

        MCTemp.LoadChartOptions();
      },
      () => {
        let MCTemp = this.CompositeCharts['RTDResultsMalaria'];
      },
      () => {
        let MCTemp = this.CompositeCharts['RTDResultsMalaria'];

        MCTemp.ChartOptions = {
          title: {
            text: 'RDT Results (Malaria)',
            align: 'left'
          },
          chart: {
            type: "pie",
          },
          colors: [
            "#FF0000",
            "#FFA500"
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

    //#region Load Chart --> RDT Results Leptospirosis
    this.CompositeCharts['RTDResultsLeptospirosis'] = new AFIChart(this.http);
    this.CompositeCharts['RTDResultsLeptospirosis'].loadData(
      "overview/RTDResultsLeptospirosis",
      () => {
        let MCTemp = this.CompositeCharts['RTDResultsLeptospirosis'];

        for (let index = 0; index < 2; index++) {
          MCTemp.ChartSeries.push([]);
          MCTemp.ChartSeries[index].push(Math.floor(Math.random() * 1000));
          MCTemp.ChartSeries[index].push(0);
        }

        MCTemp.LoadChartOptions();
      },
      () => {
        let MCTemp = this.CompositeCharts['RTDResultsLeptospirosis'];
      },
      () => {
        let MCTemp = this.CompositeCharts['RTDResultsLeptospirosis'];

        MCTemp.ChartOptions = {
          title: {
            text: 'RDT Results (Leptospirosis)',
            align: 'left'
          },
          chart: {
            type: "pie",
          },
          colors: [
            "#FF0000",
            "#FFA500"
          ],
          series: [
            {
              showInLegend: true,
              name: "Data",
              type: 'pie',
              data: [
                ["Positive (" + MCTemp.ChartSeries[0][1] + "%)", MCTemp.ChartSeries[0][0]],
                ["Negative (" + MCTemp.ChartSeries[1][1] + "%)", MCTemp.ChartSeries[1][0]],
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

    //#region Load Chart --> PCR Results
    this.CompositeCharts['PCRResults'] = new AFIChart(this.http);
    this.CompositeCharts['PCRResults'].loadData(
      "overview/PCRResults",
      () => {
        let MCTemp = this.CompositeCharts['PCRResults'];

        MCTemp.ChartSeries.push([]);
        MCTemp.ChartSeries.push([]);

        for (let index = 0; index < 15; index++) {
          MCTemp.ChartSeries[0].push(Math.floor(Math.random() * 1000));
          // MCTemp.ChartSeries[index].push(0);
        }

        MCTemp.LoadChartOptions();
      },
      () => {
        let MCTemp = this.CompositeCharts['PCRResults'];
      },
      () => {
        let MCTemp = this.CompositeCharts['PCRResults'];

        MCTemp.ChartOptions = {
          title: {
            text: 'Molecular PCR laboratory results',
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
          xAxis: {
            categories: ["Negative", "Plasmodium", "HIV-1", "Salmonella", "Rickettsia", "Dengue", "Brucella", "S.pneumoniae", "Chikungunya", "Leishmania", "Bartonella", "Leptospira", "C.burnetii", "Rift Valley Fever", "B.pseudomallei"],
            title: { text: '' },
            reversed: false,
          },
          yAxis: [
            {
              title: {
                text: '',
              },
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
              name: 'Count',
              data: MCTemp.ChartSeries[0],
              color: '#008000',
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

    //#region Load Chart --> Priority IDSR immediately reportable Diseases/Microbes
    this.CompositeCharts['priorityIDSRReportableDiseases'] = new AFIChart(this.http);
    this.CompositeCharts['priorityIDSRReportableDiseases'].loadData(
      "overview/priorityIDSRReportableDiseases",
      () => {
        let MCTemp = this.CompositeCharts['priorityIDSRReportableDiseases'];

        for (let index = 0; index < 2; index++) {
          MCTemp.ChartSeries.push([]);
          MCTemp.ChartSeries[index].push(Math.floor(Math.random() * 1000));
          MCTemp.ChartSeries[index].push(0);
        }

        MCTemp.LoadChartOptions();
      },
      () => {
        let MCTemp = this.CompositeCharts['priorityIDSRReportableDiseases'];
      },
      () => {
        let MCTemp = this.CompositeCharts['priorityIDSRReportableDiseases'];

        MCTemp.ChartOptions = {
          title: {
            text: 'Priority IDSR immediately reportable Diseases/Microbes',
            align: 'left'
          },
          chart: {
            type: "pie",
          },
          colors: [
            "blue",
            "indigo"
          ],
          series: [
            {
              showInLegend: true,
              name: "Data",
              type: 'pie',
              data: [
                ["Dengue (" + MCTemp.ChartSeries[0][1] + "%)", MCTemp.ChartSeries[0][0]],
                ["Rift Valley Fever (" + MCTemp.ChartSeries[1][1] + "%)", MCTemp.ChartSeries[1][0]],
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

    //#region Load Chart --> Mongthly IDSR reportable Diseases/Microbes
    this.CompositeCharts['monthlyIDSRReportableDiseases'] = new AFIChart(this.http);
    this.CompositeCharts['monthlyIDSRReportableDiseases'].loadData(
      "overview/monthlyIDSRReportableDiseases",
      () => {
        let MCTemp = this.CompositeCharts['monthlyIDSRReportableDiseases'];

        for (let index = 0; index < 4; index++) {
          MCTemp.ChartSeries.push([]);
          MCTemp.ChartSeries[index].push(Math.floor(Math.random() * 1000));
          MCTemp.ChartSeries[index].push(0);
        }

        MCTemp.LoadChartOptions();
      },
      () => {
        let MCTemp = this.CompositeCharts['monthlyIDSRReportableDiseases'];
      },
      () => {
        let MCTemp = this.CompositeCharts['monthlyIDSRReportableDiseases'];

        MCTemp.ChartOptions = {
          title: {
            text: 'Mongthly IDSR reportable Diseases/Microbes',
            align: 'left'
          },
          chart: {
            type: "pie",
          },
          colors: [
            "indigo",
            "gray",
            "skyblue",
            "green"
          ],
          series: [
            {
              showInLegend: true,
              name: "Data",
              type: 'pie',
              data: [
                ["HIV 1 (" + MCTemp.ChartSeries[0][1] + "%)", MCTemp.ChartSeries[0][0]],
                ["S. pneumoniae (" + MCTemp.ChartSeries[1][1] + "%)", MCTemp.ChartSeries[1][0]],
                ["Leishmania (" + MCTemp.ChartSeries[2][1] + "%)", MCTemp.ChartSeries[1][0]],
                ["Plasmodium (" + MCTemp.ChartSeries[3][1] + "%)", MCTemp.ChartSeries[1][0]]
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

    //#region Load Chart --> SARS-COV-2 Positivity
    this.CompositeCharts['SARSCOV2Positivity'] = new AFIChart(this.http);
    this.CompositeCharts['SARSCOV2Positivity'].loadData(
      "overview/SARSCOV2Positivity",
      () => {
        let MCTemp = this.CompositeCharts['SARSCOV2Positivity'];

        for (let index = 0; index < 2; index++) {
          MCTemp.ChartSeries.push([]);
          MCTemp.ChartSeries[index].push(Math.floor(Math.random() * 1000));
          MCTemp.ChartSeries[index].push(0);
        }

        MCTemp.LoadChartOptions();
      },
      () => {
        let MCTemp = this.CompositeCharts['SARSCOV2Positivity'];
      },
      () => {
        let MCTemp = this.CompositeCharts['SARSCOV2Positivity'];

        MCTemp.ChartOptions = {
          title: {
            text: 'SARS-COV-2 Positivity',
            align: 'left'
          },
          chart: {
            type: "pie",
          },
          colors: [
            "red",
            "green"
          ],
          series: [
            {
              showInLegend: true,
              name: "Data",
              type: 'pie',
              data: [
                ["Positive (" + MCTemp.ChartSeries[0][1] + "%)", MCTemp.ChartSeries[0][0]],
                ["Negative (" + MCTemp.ChartSeries[1][1] + "%)", MCTemp.ChartSeries[1][0]],
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

    //#region Load Chart --> Screened Cascade
    this.CompositeCharts['screenedCascade'] = new AFIChart(this.http);
    this.CompositeCharts['screenedCascade'].loadData(
      "overview/AFICascade",
      () => {
        let MCTemp = this.CompositeCharts['screenedCascade'];

        for (let i = 0; i < 2; i++) {
          MCTemp.ChartSeries.push(0);
          MCTemp.ChartSeries.push(0);
        }

        MCTemp.LoadChartOptions();
      },
      () => {
        let MCTemp = this.CompositeCharts['screenedCascade'];

        MCTemp.ChartSeries[0] = MCTemp.ChartData[0].ScreenedNumber;
      },
      () => {
        let MCTemp = this.CompositeCharts['screenedCascade'];

        MCTemp.ChartOptions = {
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
              data: [MCTemp.ChartSeries[0]],
              tooltip: {
                valueSuffix: '',
              },
            }
          ],
          credits: {
            enabled: false,
          }
        }
      }
    );
    //#endregion

    //#region Load Chart --> Eligible Cascade
    this.CompositeCharts['aligibleCascade'] = new AFIChart(this.http);
    this.CompositeCharts['aligibleCascade'].loadData(
      "overview/AFICascade",
      () => {
        let MCTemp = this.CompositeCharts['aligibleCascade'];

        for (let i = 0; i < 2; i++) {
          MCTemp.ChartSeries.push(0);
          MCTemp.ChartSeries.push(0);
        }

        MCTemp.LoadChartOptions();
      },
      () => {
        let MCTemp = this.CompositeCharts['aligibleCascade'];

        MCTemp.ChartSeries[0] = MCTemp.ChartData[0].EligibleNumber;
        MCTemp.ChartSeries[1] = MCTemp.ChartData[0].EligiblePercentage;
      },
      () => {
        let MCTemp = this.CompositeCharts['aligibleCascade'];

        MCTemp.ChartOptions = {
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
              data: [MCTemp.ChartSeries[1]],
              tooltip: {
                valueSuffix: '',
              },
            }
          ],
          credits: {
            enabled: false,
          }
        }
      }
    );
    //#endregion

    //#region Load Chart --> Enrolled Cascade
    this.CompositeCharts['enrolledCascade'] = new AFIChart(this.http);
    this.CompositeCharts['enrolledCascade'].loadData(
      "overview/AFICascade",
      () => {
        let MCTemp = this.CompositeCharts['enrolledCascade'];

        for (let i = 0; i < 2; i++) {
          MCTemp.ChartSeries.push(0);
          MCTemp.ChartSeries.push(0);
        }

        MCTemp.LoadChartOptions();
      },
      () => {
        let MCTemp = this.CompositeCharts['enrolledCascade'];

        MCTemp.ChartSeries[0] = MCTemp.ChartData[0].EnrolledNumber;
        MCTemp.ChartSeries[1] = MCTemp.ChartData[0].EnrolledPercentage;
      },
      () => {
        let MCTemp = this.CompositeCharts['enrolledCascade'];

        MCTemp.ChartOptions = {
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
              data: [MCTemp.ChartSeries[1]],
              tooltip: {
                valueSuffix: '',
              },
            }
          ],
          credits: {
            enabled: false,
          }
        }
      }
    );
    //#endregion

    //#region Load Chart --> Sampled Cascade
    this.CompositeCharts['sampledCascade'] = new AFIChart(this.http);
    this.CompositeCharts['sampledCascade'].loadData(
      "overview/AFICascade",
      () => {
        let MCTemp = this.CompositeCharts['sampledCascade'];

        for (let i = 0; i < 2; i++) {
          MCTemp.ChartSeries.push(0);
          MCTemp.ChartSeries.push(0);
        }

        MCTemp.LoadChartOptions();
      },
      () => {
        let MCTemp = this.CompositeCharts['sampledCascade'];

        MCTemp.ChartSeries[0] = MCTemp.ChartData[0].SampledNumber;
        MCTemp.ChartSeries[1] = MCTemp.ChartData[0].SampledPercentage;
      },
      () => {
        let MCTemp = this.CompositeCharts['sampledCascade'];

        MCTemp.ChartOptions = {
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
              data: [MCTemp.ChartSeries[1]],
              tooltip: {
                valueSuffix: '',
              },
            }
          ],
          credits: {
            enabled: false,
          }
        }
      }
    );
    //#endregion

    //#region Load Chart --> Geographic distribution of pathogen
    this.CompositeCharts['geographicDistributionOfPathogen'] = new AFIChart(this.http);
    this.CompositeCharts['geographicDistributionOfPathogen'].loadData(
      "overview/geographicDistributionOfPathogen",
      () => {
        let MCTemp = this.CompositeCharts['geographicDistributionOfPathogen'];

        for (let index = 0; index < 2; index++) {
          MCTemp.ChartSeries.push([]);
          MCTemp.ChartSeries[index].push(Math.floor(Math.random() * 1000));
          MCTemp.ChartSeries[index].push(0);
        }

        MCTemp.LoadChartOptions();
      },
      () => {
        let MCTemp = this.CompositeCharts['geographicDistributionOfPathogen'];
      },
      () => {
        let MCTemp = this.CompositeCharts['geographicDistributionOfPathogen'];

        MCTemp.ChartOptions = {
          chart: {
            type: "map",
            map: topography
          },
          title: {
            text: 'Geographical distribution of pathogen'
          },
          legend: {
            enabled: false
          },
          mapNavigation: {
            enabled: true,
            buttonOptions: {
              verticalAlign: 'bottom'
            }
          },
          mapView: {
            center: [37.8, 0.6],
            zoom: 5.5,
          },

          series: [{
            name: 'Countries',
            color: '#E0E0E0',
            enableMouseTracking: false
          }, {
            type: 'mapbubble',
            name: 'Pathogen',
            joinBy: ['x', 'y'],
            // joinBy: ['iso-a3', 'code3'],
            data: topographyData,
            minSize: 4,
            maxSize: '12%',
            tooltip: {
              pointFormat: '{point.facility} ({point.z})'
            }
          }],
          credits: {
            enabled: false,
          }
        }

        let TempChart = new Highcharts.MapChart('geographicDistributionOfPathogen', MCTemp.ChartOptions);
      }
    );
    //#endregion

    HC_exporting(Highcharts);
  }
}