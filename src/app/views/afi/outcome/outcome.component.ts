import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { AFIProperties } from '../../../models/afi/AFIProperties.model';
import { AFIChart } from '../../../models/afi/AFIChart.model';
import { ACParent } from '../../../models/afi/ACParent.model';

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

export class AOutcomeComponent implements OnInit {
  //#region Prerequisites
  CompositeCharts: ACParent = {};
  highcharts = Highcharts;
  //#endregion

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadCharts();
  }

  loadCharts() {
    //#region Load Chart --> AFI Diagnosis
    this.CompositeCharts['AFIDiagnosis'] = new AFIChart(this.http);
    this.CompositeCharts['AFIDiagnosis'].loadData(
      "overview/AFIDiagnosis",
      () => {
        let MCTemp = this.CompositeCharts['AFIDiagnosis'];

        for (let index = 0; index < 10; index++) {
          MCTemp.ChartSeries.push([]);
          MCTemp.ChartSeries[index].push(Math.floor(Math.random() * 1000));
          MCTemp.ChartSeries[index].push(0);
        }

        MCTemp.LoadChartOptions();
      },
      () => {
        let MCTemp = this.CompositeCharts['AFIDiagnosis'];
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
          }
        }
      }
    );
    //#endregion

    //#region Load Chart --> AFI Outcome
    this.CompositeCharts['AFIOutcome'] = new AFIChart(this.http);
    this.CompositeCharts['AFIOutcome'].loadData(
      "overview/AFIOutcome",
      () => {
        let MCTemp = this.CompositeCharts['AFIOutcome'];

        for (let index = 0; index < 6; index++) {
          MCTemp.ChartSeries.push([]);
          MCTemp.ChartSeries[index].push(Math.floor(Math.random() * 1000));
          MCTemp.ChartSeries[index].push(0);
        }

        MCTemp.LoadChartOptions();
      },
      () => {
        let MCTemp = this.CompositeCharts['AFIOutcome'];
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
          colors: [
            "#FFA500",
            "#FF0000",
            "#234FEA",
            "#008000"
          ],
          series: [
            {
              showInLegend: false,
              name: "Data",
              type: 'pie',
              data: [
                ["Dishcarged home in stabel condition (" + MCTemp.ChartSeries[0][1] + "%)", MCTemp.ChartSeries[0][0]],
                ["Died (" + MCTemp.ChartSeries[1][1] + "%)", MCTemp.ChartSeries[1][0]],
                ["Absconded (" + MCTemp.ChartSeries[2][1] + "%)", MCTemp.ChartSeries[2][0]],
                ["Transferred to another hospital (" + MCTemp.ChartSeries[3][1] + "%)", MCTemp.ChartSeries[3][0]],
                ["Discharged home against medical advice (" + MCTemp.ChartSeries[4][1] + "%)", MCTemp.ChartSeries[4][0]],
                ["Discharged home in critical condition (" + MCTemp.ChartSeries[5][1] + "%)", MCTemp.ChartSeries[5][0]]
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
          }
        }
      }
    );
    //#endregion

    //#region Load Chart --> AFI Other diagnosis
    this.CompositeCharts['AFIDiagnosisOther'] = new AFIChart(this.http);
    this.CompositeCharts['AFIDiagnosisOther'].loadData(
      "overview/AFIDiagnosisOther",
      () => {
        let MCTemp = this.CompositeCharts['AFIDiagnosisOther'];

        for (let index = 0; index < 12; index++) {
          MCTemp.ChartSeries.push(Math.floor(Math.random() * 1000));
        }

        MCTemp.LoadChartOptions();
      },
      () => {
        let MCTemp = this.CompositeCharts['AFIDiagnosisOther'];
      },
      () => {
        let MCTemp = this.CompositeCharts['AFIDiagnosisOther'];

        MCTemp.ChartOptions = {
          title: {
            text: 'Outcome',
            align: 'left'
          },
          chart: {
            type: "pie",
          },
          colors: [
            "#FFA500",
            "#FF0000",
            "#234FEA",
            "#008000"
          ],
          series: [
            {
              showInLegend: false,
              name: "Data",
              type: 'wordcloud',
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
          }
        }
      }
    );
    //#endregion
  }
}
