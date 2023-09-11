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
import wordCloud from "highcharts/modules/wordcloud.js"
import { HttpClient } from '@angular/common/http';

HighchartsMore(Highcharts);
HighchartsSolidGauge(Highcharts);
wordCloud(Highcharts);

@Component({
  templateUrl: 'outcome.component.html',
  styleUrls: ['outcome.component.scss']
})

export class OutcomeComponent implements OnInit {
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
    //#region Load Chart --> Enrolled with diagnosis
    this.CompositeCharts['enrolledWithDiagnosis'] = new Chart(this.http);
    this.CompositeCharts['enrolledWithDiagnosis'].loadData(
      "outcome/enrolledWithDiagnosis",
      () => {
        let MCTemp = this.CompositeCharts['enrolledWithDiagnosis'];

        for (let i = 0; i < 3; i++) {
          MCTemp.ChartSeries.push(0);
        }

        MCTemp.LoadChartOptions();
      },
      () => {
        let MCTemp = this.CompositeCharts['enrolledWithDiagnosis'];

        MCTemp.ChartSeries[0] = MCTemp.ChartData[0].EnrolledNumber;
        MCTemp.ChartSeries[1] = MCTemp.ChartData[0].HaveADiagnosisNumber;
        MCTemp.ChartSeries[2] = MCTemp.ChartData[0].OfEnrolledHaveADocumentedPercentage;
      },
      () => {
        let MCTemp = this.CompositeCharts['enrolledWithDiagnosis'];

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
              y: -80,
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
                format: "<span style='color: #234FEA; font-size: 22px'>{y}%</span>"
              },
            },
          },
          series: [
            {
              name: '',
              type: 'solidgauge',
              data: [MCTemp.ChartSeries[2]],
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

    //#region Load Chart --> Enrolled with outcome
    this.CompositeCharts['enrolledWithOutcome'] = new Chart(this.http);
    this.CompositeCharts['enrolledWithOutcome'].loadData(
      "outcome/enrolledWithOutcome",
      () => {
        let MCTemp = this.CompositeCharts['enrolledWithOutcome'];

        for (let i = 0; i < 3; i++) {
          MCTemp.ChartSeries.push(0);
        }

        MCTemp.LoadChartOptions();
      },
      () => {
        let MCTemp = this.CompositeCharts['enrolledWithOutcome'];

        MCTemp.ChartSeries[0] = MCTemp.ChartData[0].EnrolledNumber;
        MCTemp.ChartSeries[1] = MCTemp.ChartData[0].HaveADiagnosisNumber;
        MCTemp.ChartSeries[2] = MCTemp.ChartData[0].OfEnrolledHaveOutcomePercentage;
      },
      () => {
        let MCTemp = this.CompositeCharts['enrolledWithOutcome'];

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
              y: -80,
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
                format: "<span style='color: #234FEA; font-size: 22px'>{y}%</span>"
              },
            },
          },
          series: [
            {
              name: '',
              type: 'solidgauge',
              data: [MCTemp.ChartSeries[2]],
              tooltip: {
                valueSuffix: '',
              }
            }
          ],
          credits: {
            enabled: false,
          }
        }
      }
    );
    //#endregion

    //#region Load Chart --> AFI Diagnosis [No query]
    this.CompositeCharts['AFIDiagnosis'] = new Chart(this.http);
    this.CompositeCharts['AFIDiagnosis'].loadData(
      "outcome/AFIDiagnosis",
      () => {
        let MCTemp = this.CompositeCharts['AFIDiagnosis'];

        for (let index = 0; index < 10; index++) {
          MCTemp.ChartSeries.push([]);
          MCTemp.ChartSeries[index].push(Math.floor(Math.random() * 100));
          MCTemp.ChartSeries[index].push(0);
        }

        MCTemp.LoadChartOptions();
      },
      () => {
        let MCTemp = this.CompositeCharts['AFIDiagnosis'];

        // MCTemp.ChartSeries = [];
        // MCTemp.ChartData.forEach((dataInstance, index) => {
        //   MCTemp.ChartSeries.push([]);
        //   MCTemp.ChartSeries[index].push(dataInstance.OutcomeDescription + "(" + dataInstance.OutcomePercentage + "%)");
        //   MCTemp.ChartSeries[index].push(dataInstance.OutcomeNumber);
        // });
      },
      () => {
        let MCTemp = this.CompositeCharts['AFIDiagnosis'];

        MCTemp.ChartOptions = {
          title: {
            text: 'Diagnosis',
            align: 'left'
          },
          chart: {
            type: "pie",
          },
          // colors: [
          //   "#FF0000",
          //   "#008000"
          // ],
          series: [
            {
              // showInLegend: true,
              name: "Data",
              type: 'pie',
              data: [
                ["Other (" + MCTemp.ChartSeries[0][1] + "%)", MCTemp.ChartSeries[0][0]],
                ["Pneumonia (" + MCTemp.ChartSeries[1][1] + "%)", MCTemp.ChartSeries[1][0]],
                ["Malaria (" + MCTemp.ChartSeries[2][1] + "%)", MCTemp.ChartSeries[2][0]],
                ["Pneumonia, Other (" + MCTemp.ChartSeries[3][1] + "%)", MCTemp.ChartSeries[3][0]],
                ["Malaria, Other (" + MCTemp.ChartSeries[4][1] + "%)", MCTemp.ChartSeries[4][0]],
                ["Gastro enteritis, Other (" + MCTemp.ChartSeries[5][1] + "%)", MCTemp.ChartSeries[5][0]],
                ["Gastro enteritis (" + MCTemp.ChartSeries[6][1] + "%)", MCTemp.ChartSeries[6][0]],
                ["Pneumonia, Gastro enteritis (" + MCTemp.ChartSeries[7][1] + "%)", MCTemp.ChartSeries[7][0]],
                ["Pneumonia, Malaria (" + MCTemp.ChartSeries[8][1] + "%)", MCTemp.ChartSeries[8][0]],
                ["Menengitis, Other (" + MCTemp.ChartSeries[9][1] + "%)", MCTemp.ChartSeries[9][0]]
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
            }
          },
          credits: {
            enabled: false,
          }
        }
      }
    );
    //#endregion

    //#region Load Chart --> AFI Outcome
    this.CompositeCharts['AFIOutcome'] = new Chart(this.http);
    this.CompositeCharts['AFIOutcome'].loadData(
      "outcome/AFIOutcome",
      () => {
        let MCTemp = this.CompositeCharts['AFIOutcome'];

        for (let index = 0; index < 6; index++) {
          MCTemp.ChartSeries.push([]);
          MCTemp.ChartSeries[index].push(0);
          MCTemp.ChartSeries[index].push(0);
          // MCTemp.ChartSeries[index].push(0);
        }

        MCTemp.LoadChartOptions();
      },
      () => {
        let MCTemp = this.CompositeCharts['AFIOutcome'];

        MCTemp.ChartSeries = [];
        MCTemp.ChartData.forEach((dataInstance, index) => {
          MCTemp.ChartSeries.push([]);
          MCTemp.ChartSeries[index].push(dataInstance.OutcomeDescription + "(" + dataInstance.OutcomePercentage + "%)");
          MCTemp.ChartSeries[index].push(dataInstance.OutcomeNumber);
        });
      },
      () => {
        let MCTemp = this.CompositeCharts['AFIOutcome'];

        MCTemp.ChartOptions = {
          title: {
            text: 'Outcome',
            align: 'left'
          },
          chart: {
            type: "pie",
          },
          // colors: [
          //   "#FFA500",
          //   "#FF0000",
          //   "#234FEA",
          //   "#008000"
          // ],
          series: [
            {
              showInLegend: false,
              name: "Data",
              type: 'pie',
              data: MCTemp.ChartSeries
            }
          ],
          plotOptions: {
            pie: {
              innerSize: "60%",
              depth: 25,
              dataLabels: {
                enabled: true
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

    //#region Load Chart --> AFI Other diagnosis
    this.CompositeCharts['AFIDiagnosisOther'] = new Chart(this.http);
    this.CompositeCharts['AFIDiagnosisOther'].loadData(
      "outcome/AFIDiagnosisOther",
      () => {
        let MCTemp = this.CompositeCharts['AFIDiagnosisOther'];

        for (let index = 0; index < 20; index++) {
          MCTemp.ChartSeries.push(index);
          MCTemp.ChartSeries.push(index);
        }

        MCTemp.LoadChartOptions();
      },
      () => {
        let MCTemp = this.CompositeCharts['AFIDiagnosisOther'];

        // MCTemp.ChartSeries = [];
        // MCTemp.ChartData.forEach((dataInstance, index) => {
        //   MCTemp.ChartSeries.push([]);
        //   MCTemp.ChartSeries[index].push(dataInstance.Otheradmissiondiagnosis);
        //   MCTemp.ChartSeries[index].push(dataInstance.Weight);
        // });
      },
      () => {
        let MCTemp = this.CompositeCharts['AFIDiagnosisOther'];

        MCTemp.ChartOptions = {
          title: {
            text: 'Outcome (Others',
            align: 'left'
          },
          chart: {
            type: "pie",
          },
          // colors: [
          //   "#FFA500",
          //   "#FF0000",
          //   "#234FEA",
          //   "#008000"
          // ],
          series: [
            {
              showInLegend: false,
              name: "Data",
              type: 'wordcloud',
              // data: MCTemp.ChartSeries
              data: [
                ["Febrille", MCTemp.ChartSeries[0]],
                ["Anaemia", MCTemp.ChartSeries[1]],
                ["Acute", MCTemp.ChartSeries[2]],
                ["dehydration", MCTemp.ChartSeries[2]],
                ["Severe", MCTemp.ChartSeries[4]],
                ["Malnutrition", MCTemp.ChartSeries[5]],
                ["Convulsions", MCTemp.ChartSeries[6]],
                ["Mellitus", MCTemp.ChartSeries[7]],
                ["Obstruction", MCTemp.ChartSeries[8]],
                ["Rickets", MCTemp.ChartSeries[9]],
                ["Infection", MCTemp.ChartSeries[10]],
                ["Burns", MCTemp.ChartSeries[11]],
              ]
            }
          ],
          plotOptions: {
            pie: {
              innerSize: "60%",
              depth: 25,
              dataLabels: {
                enabled: true
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

    HC_exporting(Highcharts);
  }
}
