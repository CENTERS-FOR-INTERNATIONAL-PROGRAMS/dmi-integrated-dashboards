import { HttpClient } from '@angular/common/http';
import { ReviewService } from '../../../services/mortality_ncov/service';
import { Component, OnInit } from '@angular/core';
import { Chart } from '../../../models/mortality_ncov/Chart.model';
import { ChartParent } from '../../../models/mortality_ncov/ChartParent.model';

import { Covid19Summary } from '../../../models/mortality_ncov/covid19Summary.model';
import { IDFilter } from '../../../models/IDFilter.model';
import { APIReader } from '../../../models/APIReader.model';
import { IDFacility } from '../../../models/IDFacility.model';
import { GroupedCategory } from '../../../models/GroupedCategory.model';

import * as Highcharts from 'highcharts';

@Component({
  templateUrl: 'overview.component.html',
  styleUrls: ['overview.component.scss'],
})

export class OverviewComponent implements OnInit {
  //#region Prerequisites
  protected highcharts = Highcharts;
  protected CompositeCharts: ChartParent = {};

  protected APIReaderInstance = new APIReader(this.http);
  protected DataFilterInstance = new IDFilter();
  protected CompositeFacilities: any[] = [];
  //#endregion

  //#region Prerequisites --> COVID-19 Summary
  covid19Summary: Covid19Summary[] = [];
  covid19SummaryByMonth: Covid19Summary[] = [];

  covid19SummaryGroup: any[][] = [];
  covid19SummarySeries: any[] = [];
  covid19SummaryOptions: {} = {};
  //#endregion

  constructor(private reviewService: ReviewService, private http: HttpClient) { }

  ngOnInit(): void {
    this.loadFilters();
    this.loadCharts();
    this.loadCovid19SummaryData();
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

    this.loadCovid19SummaryData();
  }

  attachGroupedCategory(GCHaystack: any[], gc_name: string, gc_last: boolean) {
    let gc_found = -1;

    GCHaystack.forEach((GCInstance, index) => {
      if (GCInstance.name == gc_name) {
        gc_found = index;
      }
    });

    if (gc_found == -1) {
      if (gc_last) {
        GCHaystack.push(gc_name);
      } else {
        GCHaystack.push(new GroupedCategory(gc_name, []));
      }
      gc_found = (GCHaystack.length - 1);
    }

    return gc_found;
  }

  loadCharts() {
    //#region Load Chart --> Screened Cascade
    this.CompositeCharts['screenedCascade'] = new Chart(this.http);
    this.CompositeCharts['screenedCascade'].loadData(
      "overview/findSummary",
      () => {
        let MCTemp = this.CompositeCharts['screenedCascade'];

        for (let i = 0; i < 3; i++) {
          MCTemp.ChartSeries.push(0);
          MCTemp.ChartSeries.push(0);
        }

        MCTemp.LoadChartOptions();
      },
      () => {
        let MCTemp = this.CompositeCharts['screenedCascade'];

        MCTemp.ChartSeries[0] = MCTemp.ChartData[0].TotalScreened;
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
    this.CompositeCharts['eligibleCascade'] = new Chart(this.http);
    this.CompositeCharts['eligibleCascade'].loadData(
      "overview/findSummary",
      () => {
        let MCTemp = this.CompositeCharts['eligibleCascade'];

        for (let i = 0; i < 3; i++) {
          MCTemp.ChartSeries.push(0);
          MCTemp.ChartSeries.push(0);
        }

        MCTemp.LoadChartOptions();
      },
      () => {
        let MCTemp = this.CompositeCharts['eligibleCascade'];

        MCTemp.ChartSeries[0] = MCTemp.ChartData[0].Eligible;
        MCTemp.ChartSeries[1] = MCTemp.ChartData[0].PercentEligible;
      },
      () => {
        let MCTemp = this.CompositeCharts['eligibleCascade'];

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
    this.CompositeCharts['enrolledCascade'] = new Chart(this.http);
    this.CompositeCharts['enrolledCascade'].loadData(
      "overview/findSummary",
      () => {
        let MCTemp = this.CompositeCharts['enrolledCascade'];

        for (let i = 0; i < 3; i++) {
          MCTemp.ChartSeries.push(0);
          MCTemp.ChartSeries.push(0);
        }

        MCTemp.LoadChartOptions();
      },
      () => {
        let MCTemp = this.CompositeCharts['enrolledCascade'];

        MCTemp.ChartSeries[0] = MCTemp.ChartData[0].Enrolled;
        MCTemp.ChartSeries[1] = MCTemp.ChartData[0].PercentEnrolled;
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

    //#region Load Chart --> Tested Cascade
    this.CompositeCharts['testedCascade'] = new Chart(this.http);
    this.CompositeCharts['testedCascade'].loadData(
      "overview/findSummary",
      () => {
        let MCTemp = this.CompositeCharts['testedCascade'];

        for (let i = 0; i < 3; i++) {
          MCTemp.ChartSeries.push(0);
          MCTemp.ChartSeries.push(0);
        }

        MCTemp.LoadChartOptions();
      },
      () => {
        let MCTemp = this.CompositeCharts['testedCascade'];

        MCTemp.ChartSeries[0] = MCTemp.ChartData[0].Tested;
        MCTemp.ChartSeries[1] = MCTemp.ChartData[0].PercentTested;
      },
      () => {
        let MCTemp = this.CompositeCharts['testedCascade'];

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

    //#region Load Chart --> Positive Cascade
    this.CompositeCharts['positiveCascade'] = new Chart(this.http);
    this.CompositeCharts['positiveCascade'].loadData(
      "overview/findSummary",
      () => {
        let MCTemp = this.CompositeCharts['positiveCascade'];

        for (let i = 0; i < 3; i++) {
          MCTemp.ChartSeries.push(0);
          MCTemp.ChartSeries.push(0);
        }

        MCTemp.LoadChartOptions();
      },
      () => {
        let MCTemp = this.CompositeCharts['positiveCascade'];

        MCTemp.ChartSeries[0] = MCTemp.ChartData[0].Positive;
        MCTemp.ChartSeries[1] = MCTemp.ChartData[0].PercentPositive;
      },
      () => {
        let MCTemp = this.CompositeCharts['positiveCascade'];

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

    //#region Load Chart --> COVID-19 Screening and Enrollment Cascade
    this.CompositeCharts['findScreeningEnrolmentCascade'] = new Chart(this.http);
    this.CompositeCharts['findScreeningEnrolmentCascade'].loadData(
      "overview/findScreeningEnrolmentCascade",
      () => {
        let MCTemp = this.CompositeCharts['findScreeningEnrolmentCascade'];

        MCTemp.LoadChartOptions();
      },
      () => {
        let MCTemp = this.CompositeCharts['findScreeningEnrolmentCascade'];

        MCTemp.ChartSeries = [];
        MCTemp.ChartSeries.push([]);
        MCTemp.ChartSeries[0].push(MCTemp.ChartData[0].ScreenedNumber);
        MCTemp.ChartSeries[0].push(MCTemp.ChartData[0].EligibleNumber);
        MCTemp.ChartSeries[0].push(MCTemp.ChartData[0].EnrolledNumber);
        MCTemp.ChartSeries[0].push(MCTemp.ChartData[0].TestedNumber);
        MCTemp.ChartSeries[0].push(MCTemp.ChartData[0].PositiveNumber);

        // MCTemp.ChartSeries[0].push(MCTemp.ChartData[0].PositiveNumber + Math.floor(Math.random() * 200));
      },
      () => {
        let MCTemp = this.CompositeCharts['findScreeningEnrolmentCascade'];

        MCTemp.ChartOptions = {
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
            },
            allowDecimals: false
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
              color: "#234FEA",
              name: "Number",
              data: MCTemp.ChartSeries[0],
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

    //#region Load Chart --> COVID-19 Positivity By Age and Gender
    this.CompositeCharts['findPositivityByAgeGender'] = new Chart(this.http);
    this.CompositeCharts['findPositivityByAgeGender'].loadData(
      "overview/findPositivityByAgeGender",
      () => {
        let MCTemp = this.CompositeCharts['findPositivityByAgeGender'];

        MCTemp.LoadChartOptions();
      },
      () => {
        let MCTemp = this.CompositeCharts['findPositivityByAgeGender'];

        //Reset
        MCTemp.ChartSeries = [];

        //#region Init series indexes
        // Age Group(Index --> 0)
        MCTemp.ChartSeries.push([]);
        MCTemp.ChartSeries[0].push('0-4 Yrs');
        MCTemp.ChartSeries[0].push('5-14 Yrs');
        MCTemp.ChartSeries[0].push('15-34 Yrs');
        MCTemp.ChartSeries[0].push('35-64 Yrs');
        MCTemp.ChartSeries[0].push('65-84 Yrs');
        MCTemp.ChartSeries[0].push('85+ Yrs');
        MCTemp.ChartSeries[0].reverse();

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
                if (dataInstance.Sex == 'Female') {
                  MCTemp.ChartSeries[1].push(
                    dataInstance.PositiveNumber
                  );
                  female_found = true;
                }

                //Compile Male (Index --> 2)
                else if (dataInstance.Sex == 'Male') {
                  MCTemp.ChartSeries[2].push(dataInstance.PositiveNumber);
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
      },
      () => {
        let MCTemp = this.CompositeCharts['findPositivityByAgeGender'];

        MCTemp.ChartOptions = {
          title: {
            text: 'COVID-19 Positivity by Age Group and Gender',
            align: 'left',
          },
          chart: {
            // type: 'bar',
          },
          accessibility: {
            point: {
              valueDescriptionFormat: '{index}. Age {xDescription}, {value}%.',
            },
          },
          xAxis: [
            {
              title: {
                text: 'Age Group'
              },
              categories: MCTemp.ChartSeries[0]
            }, {
              title: {
                text: 'Age Group'
              },
              categories: MCTemp.ChartSeries[0],
              opposite: true,
            }
          ],
          yAxis: [
            {
              title: {
                text: 'Number tested COVID-19 positive',
                align: 'high',
                textAlign: 'center'
              },
              allowDecimals: false,
              width: '50%',
              reversed: true
            }, {
              title: {
                text: '',
              },
              allowDecimals: false,
              width: '50%',
              left: '50%',
              offset: 0,
            }
          ],
          plotOptions: {
            bar: {
              pointWidth: 35,
              dataLabels: {
                enabled: true
              }
            }
          },
          tooltip: {
            format: '<b>{series.name}, {point.category}, {y}</b>'
          },
          legend: { align: 'left', verticalAlign: 'top', y: 0, x: 80 },
          series: [
            {
              name: 'Female',
              data: MCTemp.ChartSeries[1],
              color: '#FFA500',
              xAxis: 0,
              yAxis: 0,
              type: 'bar'
            },
            {
              name: 'Male',
              data: MCTemp.ChartSeries[2],
              color: '#234FEA',
              xAxis: 1,
              yAxis: 1,
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

    //#region Load Chart --> COVID-19 Positivity by Facility
    this.CompositeCharts['findOverallPositivityByFacility'] = new Chart(this.http);
    this.CompositeCharts['findOverallPositivityByFacility'].loadData(
      "overview/findOverallPositivityByFacility",
      () => {
        let MCTemp = this.CompositeCharts['findOverallPositivityByFacility'];

        MCTemp.LoadChartOptions();
      },
      () => {
        let MCTemp = this.CompositeCharts['findOverallPositivityByFacility'];

        //Reset
        MCTemp.ChartSeries = [];

        //#region Init series indexes
        // Facilities (Index --> 0)
        MCTemp.ChartSeries.push([]);

        //Tested (Index --> 1)
        MCTemp.ChartSeries.push([]);

        //Positive (Index --> 2)
        MCTemp.ChartSeries.push([]);
        //#endregion

        //#region Push series data into array at specific indexes
        MCTemp.ChartData.forEach(dataInstance => {
          //Compile Facilities (Index --> 0)
          MCTemp.ChartSeries[0].push(dataInstance.Facility);

          //Compile Tested (Index --> 1)
          MCTemp.ChartSeries[1].push(dataInstance.TestedNumber);

          //Compile Positives (Index --> 2)
          MCTemp.ChartSeries[2].push(dataInstance.PositiveNumber);
        });
        //#endregion
      },
      () => {
        let MCTemp = this.CompositeCharts['findOverallPositivityByFacility'];

        MCTemp.ChartOptions = {
          title: {
            text: 'Tested Positive by Facility',
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
              text: "Number Tested",
            }
          },
          series: [
            {
              showInLegend: true,
              name: "Tested",
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
          },
          credits: {
            enabled: false,
          }
        }
      }
    );
    //#endregion

    //#region Load Chart --> COVID-19 Positivity Over Time
    this.CompositeCharts['findOverTime'] = new Chart(this.http);
    this.CompositeCharts['findOverTime'].loadData(
      "overview/findOverTime",
      () => {
        let MCTemp = this.CompositeCharts['findOverTime'];

        MCTemp.LoadChartOptions();
      },
      () => {
        // Prerequisites
        let MCTemp = this.CompositeCharts['findOverTime'];
        let GCPeriod: GroupedCategory[] = [];
        let GCInstance = new GroupedCategory("", []);

        // Reset
        MCTemp.ChartSeries = [];

        //#region Init series indexes
        //EpiWeek (Index --> 0)
        MCTemp.ChartSeries.push([]);

        // SampleTested (Index --> 1)
        MCTemp.ChartSeries.push([]);

        // CovidPositive (Index --> 2)
        MCTemp.ChartSeries.push([]);
        //#endregion

        //#region Push series data into array at specific indexes
        MCTemp.ChartData.forEach((dataInstance) => {
          MCTemp.ChartSeries[0].push(dataInstance.EpiWeek);
          MCTemp.ChartSeries[1].push(dataInstance.TestedNumber);
          MCTemp.ChartSeries[2].push(dataInstance.PositiveNumber);

          let gc_year_index = GCInstance.attach(GCPeriod, dataInstance.Year, false);
          let gc_month_index = GCInstance.attach(GCPeriod[gc_year_index].categories, dataInstance.Month, false);
          let gc_epiweek_index = GCInstance.attach(GCPeriod[gc_year_index].categories[gc_month_index].categories, dataInstance.EpiWeek, true);
        });
        //#endregion

        // Period (index --> 3)
        MCTemp.ChartSeries.push(JSON.parse(JSON.stringify(GCPeriod)));
      },
      () => {
        let MCTemp = this.CompositeCharts['findOverTime'];

        MCTemp.ChartOptions = {
          title: {
            text: 'COVID-19 Positivity over time',
            align: 'left',
          },
          xAxis: {
            name: "Period",
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
            categories: MCTemp.ChartSeries[3]
          },
          yAxis: [
            {
              labels: {
                format: '{value}'
              },
              title: {
                text: 'Number Tested',
              },
            },
            {
              title: {
                text: 'Percent Positive'
              },
              labels: {
                format: '{value}%',
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
              data: MCTemp.ChartSeries[1],
            },
            {
              name: 'Positivity (%)',
              type: 'spline',
              color: 'red',
              yAxis: 1,
              data: MCTemp.ChartSeries[2],
            },
          ],
          plotOptions: {
            column: {
              dataLabels: {
                enabled: true
              }
            },
            spline: {
              stacking: 'normal',
              dataLabels: {
                enabled: true,
                useHTML: true,
                format: "<span style='text-shadow: 0px 0px 3px black; color: white; font-weight: bold'>{y}%</span>"
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
  }

  loadCovid19SummaryData() {
    this.covid19SummaryGroup = [];

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

    this.reviewService.findSummaryByMonth(this.DataFilterInstance).subscribe((response) => {
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

}
