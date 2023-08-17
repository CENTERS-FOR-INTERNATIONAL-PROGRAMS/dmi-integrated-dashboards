import { ReviewService } from '../../../services/sari_ili/service';
import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { SARIProperties } from '../../../models/sari_ili/SARIProperties.model';
import { SARIILIChart } from '../../../models/sari_ili/SARIILIChart.model';
import { SCParent } from '../../../models/sari_ili/SCParent.model';

import * as Highcharts from 'highcharts/highstock';
import HC_exporting from 'highcharts/modules/exporting';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsSolidGauge from 'highcharts/modules/solid-gauge';
import { HttpClient } from '@angular/common/http';

HighchartsMore(Highcharts);
HighchartsSolidGauge(Highcharts);

@Component({
  templateUrl: 'overview.component.html',
  styleUrls: ['overview.component.scss']
})

export class SIOverviewComponent implements OnInit {
  //#region Prerequisites
  highcharts = Highcharts;
  //#endregion

  OverviewCharts: SCParent = {};

  //#region Prerequisites --> Overall SARS-COV-2 Positivity
  overallSARSCOV2Positivity: SARIProperties[] = [];
  overallSARSCOV2PositivitySeries: any[][] = [];
  overallSARSCOV2PositivityOptions: {} = {};
  //#endregion

  //#region Prerequisites --> SARS-COV-2 Positivity over time
  SARSCOV2PositivityOvertime: SARIProperties[] = [];
  SARSCOV2PositivityOvertimeSeries: any[] = [];
  SARSCOV2PositivityOvertimeOptions: {} = {};
  //#endregion

  //#region Prerequisites --> Influenza Positivity byt type over time
  influenzaPositivityByTypeOvertime: SARIProperties[] = [];
  influenzaPositivityByTypeOvertimeSeries: any[][] = [];
  influenzaPositivityByTypeOvertimeOptions: {} = {};
  //#endregion

  //#region Prerequisites --> Influenza Strains over time
  influenzaStrainsOvertime: SARIProperties[] = [];
  influenzaStrainsOvertimeSeries: any[][] = [];
  influenzaStrainsOvertimeOptions: {} = {};
  //#endregion

  //#region Prerequisites --> Influenza Hospitalization over time
  influenzaHospitalizationOvertime: SARIProperties[] = [];
  influenzaHospitalizationOvertimeSeries: any[][] = [];
  influenzaHospitalizationOvertimeOptions: {} = {};
  //#endregion

  //#region Prerequisites --> Influenza Patient Outcome
  influenzaPatientOutcome: SARIProperties[] = [];
  influenzaPatientOutcomeSeries: any[][] = [];
  influenzaPatientOutcomeOptions: {} = {};
  //#endregion

  constructor(private reviewService: ReviewService, private http: HttpClient) { }

  ngOnInit(): void {

    this.loadOverviewCharts();

    this.SARSCOV2PositivityOvertimeData();
    this.SARSCOV2PositivityOvertimeChart();

    this.overallSARCOV2PositivityData();
    this.overallSARCOV2PositivityChart();

    this.influenzaPositivityByTypeOvertimeData();
    this.influenzaPositivityByTypeOvertimeChart();

    this.influenzaStrainsOvertimeData();
    this.influenzaStrainsOvertimeChart();

    this.influenzaHospitalizationOvertimeData();
    this.influenzaHospitalizationOvertimeChart();

    this.influenzaPatientOutcomeData();
    this.influenzaPatientOutcomeChart();
  }

  loadOverviewCharts() {
    //#region Load Chart --> Influenza Types Distribution
    this.OverviewCharts['findTypesByDistribution'] = new SARIILIChart(this.http);
    this.OverviewCharts['findTypesByDistribution'].loadData(
      "overview/findTypesByDistribution",
      () => {
        let MCTemp = this.OverviewCharts['findTypesByDistribution'];

        for (let index = 0; index < 5; index++) {
          MCTemp.ChartSeries.push([]);
          MCTemp.ChartSeries[index].push(0);
          MCTemp.ChartSeries[index].push(0);
        }

        MCTemp.LoadChartOptions();
      },
      () => {
        let MCTemp = this.OverviewCharts['findTypesByDistribution'];

        // Influenza A (Index --> 0)
        //Number (Index --> [0][0])
        MCTemp.ChartSeries[0][0] = MCTemp.ChartData[0].InfluenzaAPositive;

        //Percent (Index --> [0][1])
        MCTemp.ChartSeries[0][1] = MCTemp.ChartData[0].InfluenzaAPositivePercent;

        // Influenza B (Index --> 1)
        //Number (Index --> [1][0])
        MCTemp.ChartSeries[1][0] = MCTemp.ChartData[0].InfluenzaBPositive;

        //Percent (Index --> [1][1])
        MCTemp.ChartSeries[1][1] = MCTemp.ChartData[0].InfluenzaBPositivePercent;

        // Neg Flu (Index --> 1)
        //Number (Index --> [2][0])
        MCTemp.ChartSeries[2][0] = MCTemp.ChartData[0].NegativeFluNumber;

        //Percent (Index --> [2][1])
        MCTemp.ChartSeries[2][1] = MCTemp.ChartData[0].NegativeFluPercent;
      },
      () => {
        let MCTemp = this.OverviewCharts['findTypesByDistribution'];

        MCTemp.ChartOptions = {
          title: {
            text: 'Influenza Types Distribution',
            align: 'left'
          },
          chart: {
            type: "pie",
          },
          colors: [
            "#FF0000",
            "#FFA500",
            "#234FEA",
          ],
          series: [
            {
              showInLegend: true,
              name: "Data",
              type: 'pie',
              data: [
                ["Influenza A (" + MCTemp.ChartSeries[0][1] + "%)", MCTemp.ChartSeries[0][0]],
                ["Influenza B (" + MCTemp.ChartSeries[1][1] + "%)", MCTemp.ChartSeries[1][0]],
                ["Neg Flu (" + MCTemp.ChartSeries[2][1] + "%)", MCTemp.ChartSeries[2][0]],
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
            },
          }
        }
      }
    );
    //#endregion

    //#region Load Chart --> Influenza A Subtype Distribution
    this.OverviewCharts['findInfluenzaASubtypesDistribution'] = new SARIILIChart(this.http);
    this.OverviewCharts['findInfluenzaASubtypesDistribution'].loadData(
      "overview/findInfluenzaASubtypesDistribution",
      () => {
        let MCTemp = this.OverviewCharts['findInfluenzaASubtypesDistribution'];

        for (let index = 0; index < 5; index++) {
          MCTemp.ChartSeries.push([]);
          MCTemp.ChartSeries[index].push(0);
          MCTemp.ChartSeries[index].push(0);
        }
        MCTemp.LoadChartOptions();
      },
      () => {
        let MCTemp = this.OverviewCharts['findInfluenzaASubtypesDistribution'];

        //A1H1 (Index --> 0)
        MCTemp.ChartSeries[0][0] = MCTemp.ChartData[0].AH1N1Number;
        MCTemp.ChartSeries[0][1] = MCTemp.ChartData[0].AH1N1NumberPercent;

        //AH3N2
        MCTemp.ChartSeries[1][0] = MCTemp.ChartData[0].AH3N2Number;
        MCTemp.ChartSeries[1][1] = MCTemp.ChartData[0].AH3N2NumberPercent;

        //NonSubTypable
        MCTemp.ChartSeries[2][0] = MCTemp.ChartData[0].NonSubTypableNumber;
        MCTemp.ChartSeries[2][1] = MCTemp.ChartData[0].NonSubTypableNumberPercent;

        //NotSubType
        MCTemp.ChartSeries[3][0] = MCTemp.ChartData[0].NotSubTypeNumber;
        MCTemp.ChartSeries[3][1] = MCTemp.ChartData[0].NotSubTypeNumberPercent;

        //TotalInfluenzaSubTypeA
        MCTemp.ChartSeries[4][0] = MCTemp.ChartData[0].TotalInfluenzaSubTypeA;
      },
      () => {
        let MCTemp = this.OverviewCharts['findInfluenzaASubtypesDistribution'];

        MCTemp.ChartOptions = {
          title: {
            text: 'Influenza A Subtype Distribution',
            align: 'left'
          },
          chart: {
            type: "pie",
          },
          colors: [
            "#234FEA", // Color for Category 1
            "#FC7500", // Color for Category 2
          ],
          series: [
            {
              showInLegend: true,
              name: "Data",
              type: 'pie',
              data: [
                ["A/H1N1 (" + MCTemp.ChartSeries[0][1] + "%)", MCTemp.ChartSeries[0][0]],
                ["A/H3N2 (" + MCTemp.ChartSeries[1][1] + "%)", MCTemp.ChartSeries[1][0]],
                ["Non-subtypable (" + MCTemp.ChartSeries[2][1] + "%)", MCTemp.ChartSeries[2][0]],
                ["Not yet subtyped (" + MCTemp.ChartSeries[3][1] + "%)", MCTemp.ChartSeries[3][0]]
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
            },
          }
        }
      }
    );
    //#endregion    

    //#region Load Chart --> Influenza B Lineage Distribution
    this.OverviewCharts['findInfluenzaBLineageDistribution'] = new SARIILIChart(this.http);
    this.OverviewCharts['findInfluenzaBLineageDistribution'].loadData(
      "overview/findInfluenzaBLineageDistribution",
      () => {
        let MCTemp = this.OverviewCharts['findInfluenzaBLineageDistribution'];

        for (let index = 0; index < 3; index++) {
          MCTemp.ChartSeries.push([]);
          MCTemp.ChartSeries[index].push(0);
          MCTemp.ChartSeries[index].push(0);
        }
        MCTemp.LoadChartOptions();
      },
      () => {
        let MCTemp = this.OverviewCharts['findInfluenzaBLineageDistribution'];

        //Victoria (Index --> 0)
        MCTemp.ChartSeries[0][0] = MCTemp.ChartData[0].VictoriaNumber;
        MCTemp.ChartSeries[0][1] = MCTemp.ChartData[0].VictoriaNumberPercent;

        //Yamagata (Index --> 1)
        MCTemp.ChartSeries[1][0] = MCTemp.ChartData[0].YamagataNumber;
        MCTemp.ChartSeries[1][1] = MCTemp.ChartData[0].YamagataNumberPercent;

        //Non-determined (Index --> 2)
        MCTemp.ChartSeries[2][0] = MCTemp.ChartData[0].NotdeterminedNumber;
        MCTemp.ChartSeries[2][1] = MCTemp.ChartData[0].NotdeterminedNumberPercent;
      },
      () => {
        let MCTemp = this.OverviewCharts['findInfluenzaBLineageDistribution'];

        MCTemp.ChartOptions = {
          title: {
            text: 'Influenza B Lineage Distribution',
            align: 'left'
          },
          chart: {
            type: "pie",
          },
          colors: [
            "#FF0000",
            "#008000",
            "#234FEA"
          ],
          series: [
            {
              showInLegend: true,
              name: "Data",
              type: 'pie',
              data: [
                ["B/Victoria (" + MCTemp.ChartSeries[0][1] + "%)", MCTemp.ChartSeries[0][0]],
                ["B/Yamagata (" + MCTemp.ChartSeries[1][1] + "%)", MCTemp.ChartSeries[1][0]],
                ["Not-determined (" + MCTemp.ChartSeries[2][1] + "%)", MCTemp.ChartSeries[2][0]]
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
            },
          }
        }
      }
    );
    //#endregion    
  }

  //#region Load Chart --> Overall SARS-COV-2 Positivity
  overallSARCOV2PositivityData() {
    for (let index = 0; index < 3; index++) {
      this.overallSARSCOV2PositivitySeries.push([]);
      this.overallSARSCOV2PositivitySeries[index].push(0);
      this.overallSARSCOV2PositivitySeries[index].push(0);
    }

    this.reviewService.findOverallSARSCOV2Positivity().subscribe(
      response => {
        this.overallSARSCOV2Positivity = response;

        //Positive (Index --> 0)
        this.overallSARSCOV2PositivitySeries[0][0] = this.overallSARSCOV2Positivity[0].CovidPositiveNumber;
        this.overallSARSCOV2PositivitySeries[0][1] = this.overallSARSCOV2Positivity[0].CovidPositiveNumberPercent;

        //Negative (Index --> 0)
        this.overallSARSCOV2PositivitySeries[1][0] = this.overallSARSCOV2Positivity[0].CovidNegativeNumber;
        this.overallSARSCOV2PositivitySeries[1][1] = this.overallSARSCOV2Positivity[0].CovidNegativeNumberPercent;

        this.overallSARCOV2PositivityChart();
      });
  }

  overallSARCOV2PositivityChart() {
    this.overallSARSCOV2PositivityOptions = {
      title: {
        text: 'Overall SARS-COV-2 Positivity',
        align: 'left'
      },
      chart: {
        type: "pie",
      },
      colors: [
        "#234FEA", // Color for Category 1
        "#FC7500", // Color for Category 2
      ],
      series: [
        {
          showInLegend: true,
          name: "Data",
          type: 'pie',
          data: [
            ["Positive (" + this.overallSARSCOV2PositivitySeries[0][1] + "%)", this.overallSARSCOV2PositivitySeries[0][0]],
            ["Negative (" + this.overallSARSCOV2PositivitySeries[1][1] + "%)", this.overallSARSCOV2PositivitySeries[1][0]]
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
        },
      }
    };

    HC_exporting(Highcharts);
  }
  //#endregion

  //#region Load Chart --> SARS-COV-2 Positivity over time

  SARSCOV2PositivityOvertimeData() {
    this.reviewService.findSARSCOV2PositivityOvertime().subscribe(
      response => {
        this.SARSCOV2PositivityOvertime = response;

        //#region Init series indexes
        // EpiWeek (Index --> 0)
        this.SARSCOV2PositivityOvertimeSeries.push([]);

        // Percent Positive (Index --> 1)
        this.SARSCOV2PositivityOvertimeSeries.push([]);
        //#endregion

        //#region Push series data into array at specific indexes
        this.SARSCOV2PositivityOvertime.forEach(dataInstance => {
          //Compile EpiWeek
          this.SARSCOV2PositivityOvertimeSeries[0].push(dataInstance.EPIWeek);

          //Compile Percent Positive
          this.SARSCOV2PositivityOvertimeSeries[1].push(dataInstance.Covid19PositivePercent);
        });
        //#endregion

        this.SARSCOV2PositivityOvertimeChart();
      });
  }

  SARSCOV2PositivityOvertimeChart() {
    this.SARSCOV2PositivityOvertimeOptions = {
      title: {
        text: 'SARS-COV-2 Positivity over time',
        align: 'left'
      },
      chart: {
        type: "spline"
      },
      xAxis: {
        categories: this.SARSCOV2PositivityOvertimeSeries[0],
        title: {
          text: "Epi Week",
        },
        min: 0,
        max: 22,
        scrollbar: {
          enabled: true
        }
      },
      yAxis: {
        title: {
          text: "Percent Positive",
        }
      },
      series: [
        {
          name: "SARS-COV-2 Positive (%)",
          data: this.SARSCOV2PositivityOvertimeSeries[1],
          color: "#234FEA",
        }
      ],
      plotOptions: {
        spline: {
          stacking: 'normal',
          dataLabels: {
            enabled: true
          }
        }
      },
      useHighStocks: true
    };

    HC_exporting(Highcharts);
  }

  //#endregion

  //#region Load Chart --> Influenza positivity by type overtime
  influenzaPositivityByTypeOvertimeData() {
    this.reviewService.findInfluenzaPositivityByTypeOvertime().subscribe(
      // this.reviewService.findInfluenzaHospitalizationOvertime().subscribe(
      response => {
        this.influenzaPositivityByTypeOvertime = response;

        this.influenzaPositivityByTypeOvertimeSeries.push([]);
        this.influenzaPositivityByTypeOvertimeSeries.push([]);
        this.influenzaPositivityByTypeOvertimeSeries.push([]);
        this.influenzaPositivityByTypeOvertimeSeries.push([]);
        this.influenzaPositivityByTypeOvertimeSeries.push([]);

        //#region Push series data into array at specific indexes
        this.influenzaPositivityByTypeOvertime.forEach((dataInstance, index) => {
          // this.influenzaPositivityByTypeOvertimeSeries.push([]);

          //Compile Epi Week (Index --> 0)
          this.influenzaPositivityByTypeOvertimeSeries[0].push(dataInstance.EpiWeek);

          //Compile Influenza A Positive (Index --> 1)
          this.influenzaPositivityByTypeOvertimeSeries[1].push(dataInstance.InfluenzaAPositiveNumber);

          //Compile Influenza B Positive (Index --> 2)
          this.influenzaPositivityByTypeOvertimeSeries[2].push(dataInstance.InfluenzaBPositiveNumber);

          //Compile Influenza Positive Percentage (Index --> 3)
          this.influenzaPositivityByTypeOvertimeSeries[3].push(dataInstance.InfluenzaPositivePercentage);

          //Compile Influenza Negative (Index --> 4)
          this.influenzaPositivityByTypeOvertimeSeries[4].push(dataInstance.InfluenzaNegativeNumber);
        });
        //#endregion

        this.influenzaPositivityByTypeOvertimeChart();
      });
  }

  influenzaPositivityByTypeOvertimeChart() {
    this.influenzaPositivityByTypeOvertimeOptions = {
      title: {
        text: 'Number positive for influenza by type and epiweek',
        align: 'left'
      },
      chart: {
        type: "column",
      },
      xAxis: {
        categories: this.influenzaPositivityByTypeOvertimeSeries[0],
        title: false,
        min: 0,
        max: 22,
        scrollbar: {
          enabled: true
        }
      },
      yAxis: [{
        title: {
          text: "Number tested or virus detected",
        }
      },
      {
        title: {
          text: "Influenza Positive (%)",
        },
        opposite: true
      }],
      series: [
        {
          showInLegend: true,
          name: "Influenza A Positive",
          data: this.influenzaPositivityByTypeOvertimeSeries[1],
          type: 'column',
          color: "#FC7500",
        },
        {
          showInLegend: true,
          name: "Influenza B Positive",
          data: this.influenzaPositivityByTypeOvertimeSeries[2],
          type: 'column',
          color: "#234FEA",
        },
        {
          showInLegend: true,
          name: "Influenza Positive (%)",
          data: this.influenzaPositivityByTypeOvertimeSeries[3],
          type: 'spline',
          yAxis: 1,
          color: "#FF0000",
        },
        {
          showInLegend: true,
          name: "Influenza Negative",
          data: this.influenzaPositivityByTypeOvertimeSeries[4],
          type: 'column',
          color: "#008000",
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
      useHighStocks: true
    };
  }
  //#endregion

  //#region Load Chart --> Influenza strains overtime
  influenzaStrainsOvertimeData() {
    this.reviewService.findInfluenzaStrainsOvertime().subscribe(
      response => {
        this.influenzaStrainsOvertime = response;

        this.influenzaStrainsOvertimeSeries.push([]);
        this.influenzaStrainsOvertimeSeries.push([]);
        this.influenzaStrainsOvertimeSeries.push([]);
        this.influenzaStrainsOvertimeSeries.push([]);
        this.influenzaStrainsOvertimeSeries.push([]);
        this.influenzaStrainsOvertimeSeries.push([]);
        this.influenzaStrainsOvertimeSeries.push([]);
        this.influenzaStrainsOvertimeSeries.push([]);
        this.influenzaStrainsOvertimeSeries.push([]);
        this.influenzaStrainsOvertimeSeries.push([]);

        //#region Push series data into array at specific indexes
        this.influenzaStrainsOvertime.forEach((dataInstance, index) => {
          // Epi Week (Index --> 0)
          this.influenzaStrainsOvertimeSeries[0][index] = dataInstance.EpiWeek;

          // Flu A non-subtypable 2 (Index --> 1)
          this.influenzaStrainsOvertimeSeries[1][index] = dataInstance.NonSubTypableNumber;

          // Influenza Neg (Index --> 2)
          this.influenzaStrainsOvertimeSeries[2].push(dataInstance.InfluenzaNeg);

          // A/H1N1 (Index --> 3)
          this.influenzaStrainsOvertimeSeries[3].push(dataInstance.AH1N1Number);

          // A/H3N2 (Index --> 4)
          this.influenzaStrainsOvertimeSeries[4].push(dataInstance.AH3N2Number);

          // B/Victoria (Index --> 5)
          this.influenzaStrainsOvertimeSeries[5].push(dataInstance.VictoriaNumber);

          // B/Yamagata (Index --> 6)
          this.influenzaStrainsOvertimeSeries[6].push(dataInstance.YamagataNumber);

          // Influenza B Not-determined (Index --> 7)
          this.influenzaStrainsOvertimeSeries[7].push(dataInstance.NotdeterminedNumber);

          //  Influenza Positive (Index --> 8)
          this.influenzaStrainsOvertimeSeries[8].push(0);
        });
        //#endregion

        this.influenzaStrainsOvertimeChart();
      });
  }

  influenzaStrainsOvertimeChart() {
    this.influenzaStrainsOvertimeOptions = {
      title: {
        text: 'Circulating Strains of Influenza Virus over time',
        align: 'left'
      },
      chart: {
        type: "column",
      },
      xAxis: {
        categories: this.influenzaStrainsOvertimeSeries[0],
        title: {
          text: "Epi Week"
        },
        min: 0,
        max: 22,
        scrollbar: {
          enabled: true
        }
      },
      yAxis: [{
        title: {
          text: "Number tested or virus detected",
        }
      },
      {
        title: {
          text: "Influenza Positive (%)",
        },
        opposite: true,
        inverted: true
      }],
      series: [
        {
          showInLegend: true,
          name: "Flu A non-subtypable 2",
          data: this.influenzaStrainsOvertimeSeries[1],
          type: 'column',
          color: "#234FEA",
        },
        {
          showInLegend: true,
          name: "Influenza Neg",
          data: this.influenzaStrainsOvertimeSeries[2],
          type: 'column',
          color: "#008000",
        },
        {
          showInLegend: true,
          name: "A/H1N1",
          data: this.influenzaStrainsOvertimeSeries[3],
          type: 'column',
          color: "#FF0000",
        },
        {
          showInLegend: true,
          name: "A/H3N2",
          data: this.influenzaStrainsOvertimeSeries[4],
          type: 'column',
          color: "#66B3FF",
        },
        {
          showInLegend: true,
          name: "B/Victoria",
          data: this.influenzaStrainsOvertimeSeries[5],
          type: 'column',
          color: "#FFB3E6",
        },
        {
          showInLegend: true,
          name: "B/Yamagata",
          data: this.influenzaStrainsOvertimeSeries[6],
          type: 'column',
          color: "#CCB3FF",
        },
        {
          showInLegend: true,
          name: "Influenza B Not-determined",
          data: this.influenzaStrainsOvertimeSeries[7],
          type: 'column',
          color: "#B3FFB3",
        },
        {
          showInLegend: true,
          name: " Influenza Positive",
          data: this.influenzaStrainsOvertimeSeries[8],
          type: 'spline',
          yAxis: 1,
          color: "#FC7500",
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
      useHighStocks: true
    };

    HC_exporting(Highcharts);
  }
  //#endregion

  //#region Load Chart --> Influenza hospitalization overtime
  influenzaHospitalizationOvertimeData() {
    this.reviewService.findInfluenzaHospitalizationOvertime().subscribe(
      response => {
        this.influenzaHospitalizationOvertime = response;

        this.influenzaHospitalizationOvertimeSeries.push([]);
        this.influenzaHospitalizationOvertimeSeries.push([]);
        this.influenzaHospitalizationOvertimeSeries.push([]);
        this.influenzaHospitalizationOvertimeSeries.push([]);

        //#region Push series data into array at specific indexes
        this.influenzaHospitalizationOvertime.forEach((dataInstance, index) => {
          this.influenzaHospitalizationOvertimeSeries.push([]);

          //Compile Epi Week (Index --> 0)
          this.influenzaHospitalizationOvertimeSeries[0].push(dataInstance.EpiWeek);

          //Compile Samples Tested (Index --> 1)
          this.influenzaHospitalizationOvertimeSeries[1].push(dataInstance.Tested);

          //Compile Influenza Positive Percent (Index --> 2)
          this.influenzaHospitalizationOvertimeSeries[2].push(dataInstance.InfluenzaPositivePercent);

          //Compile SARS-COV-2 Positive Percent (Index --> 3)
          this.influenzaHospitalizationOvertimeSeries[3].push(dataInstance.SARSCOV2PositivePercent);
        });
        //#endregion

        this.influenzaHospitalizationOvertimeChart();
      });
  }

  influenzaHospitalizationOvertimeChart() {
    this.influenzaHospitalizationOvertimeOptions = {
      title: {
        text: 'Weekly number of hospitalized ILI & SARI patients and percent ILI & SARI specimens testing positive for influenza and SARS-COV-2',
        align: 'left'
      },
      chart: {
        type: "column",
      },
      xAxis: {
        categories: this.influenzaHospitalizationOvertimeSeries[0],
        title: false,
        min: 0,
        max: 22,
        scrollbar: {
          enabled: true
        }
      },
      yAxis: [{
        title: {
          text: "Number tested or virus detected",
        }
      },
      {
        title: {
          text: "SARS-COV-2 Positive (%)",
        },
        opposite: true,
        inverted: true
      }],
      series: [
        {
          showInLegend: true,
          name: "Total Samples Tested",
          data: this.influenzaHospitalizationOvertimeSeries[1],
          type: 'column',
          color: "#234FEA",
        },
        {
          showInLegend: true,
          name: "Percent Influenza Positive",
          data: this.influenzaHospitalizationOvertimeSeries[2],
          type: 'spline',
          yAxis: 1,
          color: "#FC7500",
        },
        {
          showInLegend: true,
          name: "Percent SARS-COV-2 Positive",
          data: this.influenzaHospitalizationOvertimeSeries[3],
          type: 'spline',
          yAxis: 1,
          color: "#FF0000",
        },
      ],
      plotOptions: {
        column: {
          stacking: 'normal',
          dataLabels: {
            enabled: true
          }
        }
      },
      useHighStocks: true
    };
  }
  //#endregion

  //#region Load Chart --> Influenza patient outcome
  influenzaPatientOutcomeData() {
    for (let index = 0; index < 6; index++) {
      this.influenzaPatientOutcomeSeries.push([]);

      for (let j = 0; j < 2; j++) {
        this.influenzaPatientOutcomeSeries[index].push(0);
      }
    }

    this.reviewService.findInfluenzaPatientOutcome().subscribe(
      response => {
        this.influenzaPatientOutcome = response;

        //Absconded (Index --> 0)
        this.influenzaPatientOutcomeSeries[0][0] = this.influenzaPatientOutcome[0].AbscondedNumber;
        this.influenzaPatientOutcomeSeries[0][1] = this.influenzaPatientOutcome[0].AbscondedPercentage;

        //Death (Index --> 1)
        this.influenzaPatientOutcomeSeries[1][0] = this.influenzaPatientOutcome[0].DeathNumber;
        this.influenzaPatientOutcomeSeries[1][1] = this.influenzaPatientOutcome[0].DeathPercentage;

        //Discharged from hospital alive (Index --> 2)
        this.influenzaPatientOutcomeSeries[2][0] = this.influenzaPatientOutcome[0].DischargedFromHospital;
        this.influenzaPatientOutcomeSeries[2][1] = this.influenzaPatientOutcome[0].DischargedFromHospitalPercentage;

        //Reffered to another facility (Index --> 3)
        this.influenzaPatientOutcomeSeries[3][0] = this.influenzaPatientOutcome[0].RefferedToAnotherFacilityNumber;
        this.influenzaPatientOutcomeSeries[3][1] = this.influenzaPatientOutcome[0].RefferedToAnotherFacilityPercentage;

        //Refused hospital treatment (Index --> 4)
        this.influenzaPatientOutcomeSeries[4][0] = this.influenzaPatientOutcome[0].RefusedHospitalTreatment;
        this.influenzaPatientOutcomeSeries[4][1] = this.influenzaPatientOutcome[0].RefusedHospitalTreatmentPercentage;

        //Total (Index --> 5)
        this.influenzaPatientOutcomeSeries[5][0] = this.influenzaPatientOutcome[0].TotalOutcome;

        this.influenzaPatientOutcomeChart();
      });
  }

  influenzaPatientOutcomeChart() {
    this.influenzaPatientOutcomeOptions = {
      title: {
        text: 'Patient Outcome',
        align: 'left'
      },
      chart: {
        type: "pie",
      },
      colors: [
        "#FC7500",
        "#CCB3FF",
        "#FF0000",
        "#234FEA",
        "#008000"
      ],
      series: [
        {
          name: "Data",
          type: 'pie',
          data: [
            ["Death (" + this.influenzaPatientOutcomeSeries[0][1] + "%)", this.influenzaPatientOutcomeSeries[0][0]],
            ["Absconded (" + this.influenzaPatientOutcomeSeries[1][1] + "%)", this.influenzaPatientOutcomeSeries[1][0]],
            ["Discharged from Hospital Alive (" + this.influenzaPatientOutcomeSeries[2][1] + "%)", this.influenzaPatientOutcomeSeries[2][0]],
            ["Referred to another facility (" + this.influenzaPatientOutcomeSeries[3][1] + "%)", this.influenzaPatientOutcomeSeries[3][0]],
            ["Refused hospital treatment (" + this.influenzaPatientOutcomeSeries[4][1] + "%)", this.influenzaPatientOutcomeSeries[4][0]]
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

}
