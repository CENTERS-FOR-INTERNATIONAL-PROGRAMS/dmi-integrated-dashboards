import { ReviewService } from '../../../services/sari_ili/service';
import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { SARIProperties } from '../../../models/sari_ili/SARIProperties.model';

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

export class SIOverviewComponent implements OnInit {
  //#region Prerequisites
  highcharts = Highcharts;
  //#endregion

  //#region Prerequisites --> Influenza types distribution
  influenzaTypesDistribution: SARIProperties[] = [];
  influenzaTypesDistributionSeries: any[][] = [];
  influenzaTypesDistributionOptions: {} = {};
  //#endregion

  //#region Prerequisites --> Influenza A Subtype Distribution
  influenzaASubtypeDistribution: SARIProperties[] = [];
  influenzaASubtypeDistributionSeries: any[][] = [];
  influenzaASubtypeDistributionOptions: {} = {};
  //#endregion

  //#region Prerequisites --> Influenza B Lineage Distribution
  influenzaBLineageDistribution: SARIProperties[] = [];
  influenzaBLineageDistributionSeries: any[] = [];
  influenzaBLineageDistributionOptions: {} = {};
  //#endregion

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

  //#region Prerequisites --> Influenza Positivity over time
  influenzaPositivityOvertime: SARIProperties[] = [];
  influenzaPositivityOvertimeSeries: any[][] = [];
  influenzaPositivityOvertimeOptions: {} = {};
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

  constructor(private reviewService: ReviewService) { }
  ngOnInit(): void {
    this.influenzaTypesDistributionData();
    this.influenzaTypesDistributionChart();

    this.influenzaASubtypeDistributionData();
    this.influenzaASubtypeDistributionChart();

    this.influenzaBLineageDistributionData();
    this.influenzaBLineageDistributionChart();

    this.SARSCOV2PositivityOvertimeData();
    this.SARSCOV2PositivityOvertimeChart();

    this.overallSARCOV2PositivityData();
    this.overallSARCOV2PositivityChart();

    this.influenzaPositivityOvertimeData();

    this.influenzaStrainsOvertimeData();
    this.influenzaStrainsOvertimeChart();

    this.influenzaHospitalizationOvertimeData();
    this.influenzaHospitalizationOvertimeChart();

    this.influenzaPatientOutcomeData();
    this.influenzaPatientOutcomeChart();
  }

  //#region Load Chart --> Influenza Types Distribution
  influenzaTypesDistributionData() {
    for (let index = 0; index < 4; index++) {
      this.influenzaTypesDistributionSeries.push([]);
      this.influenzaTypesDistributionSeries[index].push(0);
      this.influenzaTypesDistributionSeries[index].push(0);
    }

    this.reviewService.findInfluenzaTypesDistribution().subscribe(
      response => {
        this.influenzaTypesDistribution = response;

        // Influenza A (Index --> 0)
        //Number (Index --> [0][0])
        this.influenzaTypesDistributionSeries[0][0] = this.influenzaTypesDistribution[0].InfluenzaAPositive;
        //Percent (Index --> [0][1])
        this.influenzaTypesDistributionSeries[0][1] = this.influenzaTypesDistribution[0].InfluenzaAPositivePercent;

        // Influenza B (Index --> 1)
        //Number (Index --> [1][0])
        this.influenzaTypesDistributionSeries[1][0] = this.influenzaTypesDistribution[0].InfluenzaBPositive;
        //Percent (Index --> [1][1])
        this.influenzaTypesDistributionSeries[1][1] = this.influenzaTypesDistribution[0].InfluenzaBPositivePercent;

        // Neg Flu (Index --> 1)
        //Number (Index --> [2][0])
        this.influenzaTypesDistributionSeries[2][0] = this.influenzaTypesDistribution[0].NegativeFluNumber;
        //Percent (Index --> [2][1])
        this.influenzaTypesDistributionSeries[2][1] = this.influenzaTypesDistribution[0].NegativeFluPercent;

        this.influenzaTypesDistributionChart();
      });
  }

  influenzaTypesDistributionChart() {
    this.influenzaTypesDistributionOptions = {
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
            ["Influenza A (" + this.influenzaTypesDistributionSeries[0][1] + "%)", this.influenzaTypesDistributionSeries[0][0]],
            ["Influenza B (" + this.influenzaTypesDistributionSeries[1][1] + "%)", this.influenzaTypesDistributionSeries[1][0]],
            ["Neg Flu (" + this.influenzaTypesDistributionSeries[2][1] + "%)", this.influenzaTypesDistributionSeries[2][0]],
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

  //#region Load Chart --> Influenza A Subtype Distribution
  influenzaASubtypeDistributionData() {
    for (let index = 0; index < 5; index++) {
      this.influenzaASubtypeDistributionSeries.push([]);
      this.influenzaASubtypeDistributionSeries[index].push(0);
      this.influenzaASubtypeDistributionSeries[index].push(0);
    }

    this.reviewService.findInfluenzaASubtypeDistribution().subscribe(
      response => {
        this.influenzaASubtypeDistribution = response;

        //A1H1 (Index --> 0)
        this.influenzaASubtypeDistributionSeries[0][0] = this.influenzaASubtypeDistribution[0].AH1N1Number;
        this.influenzaASubtypeDistributionSeries[0][1] = this.influenzaASubtypeDistribution[0].AH1N1NumberPercent;

        //AH3N2
        this.influenzaASubtypeDistributionSeries[1][0] = this.influenzaASubtypeDistribution[0].AH3N2Number;
        this.influenzaASubtypeDistributionSeries[1][1] = this.influenzaASubtypeDistribution[0].AH3N2NumberPercent;

        //NonSubTypable
        this.influenzaASubtypeDistributionSeries[2][0] = this.influenzaASubtypeDistribution[0].NonSubTypableNumber;
        this.influenzaASubtypeDistributionSeries[2][1] = this.influenzaASubtypeDistribution[0].NonSubTypableNumberPercent;

        //NotSubType
        this.influenzaASubtypeDistributionSeries[3][0] = this.influenzaASubtypeDistribution[0].NotSubTypeNumber;
        this.influenzaASubtypeDistributionSeries[3][1] = this.influenzaASubtypeDistribution[0].NotSubTypeNumberPercent;

        //TotalInfluenzaSubTypeA
        this.influenzaASubtypeDistributionSeries[4][0] = this.influenzaASubtypeDistribution[0].TotalInfluenzaSubTypeA;

        this.influenzaASubtypeDistributionChart();
      });
  }

  influenzaASubtypeDistributionChart() {
    this.influenzaASubtypeDistributionOptions = {
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
            ["A/H1N1 (" + this.influenzaASubtypeDistributionSeries[0][1] + "%)", this.influenzaASubtypeDistributionSeries[0][0]],
            ["A/H3N2 (" + this.influenzaASubtypeDistributionSeries[1][1] + "%)", this.influenzaASubtypeDistributionSeries[1][0]],
            ["Non-subtypable (" + this.influenzaASubtypeDistributionSeries[2][1] + "%)", this.influenzaASubtypeDistributionSeries[2][0]],
            ["Not yet subtyped (" + this.influenzaASubtypeDistributionSeries[3][1] + "%)", this.influenzaASubtypeDistributionSeries[3][0]]
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

  //#region Load Chart --> Influenza B Lineage Distribution
  influenzaBLineageDistributionData() {
    for (let index = 0; index < 3; index++) {
      this.influenzaBLineageDistributionSeries.push([]);
      this.influenzaBLineageDistributionSeries[index].push(0);
      this.influenzaBLineageDistributionSeries[index].push(0);
    }

    this.reviewService.findInfluenzaBLineageDistribution().subscribe(
      response => {
        this.influenzaBLineageDistribution = response;

        //Victoria (Index --> 0)
        this.influenzaBLineageDistributionSeries[0][0] = this.influenzaBLineageDistribution[0].VictoriaNumber;
        this.influenzaBLineageDistributionSeries[0][1] = this.influenzaBLineageDistribution[0].VictoriaNumberPercent;

        //Yamagata (Index --> 1)
        this.influenzaBLineageDistributionSeries[1][0] = this.influenzaBLineageDistribution[0].YamagataNumber;
        this.influenzaBLineageDistributionSeries[1][1] = this.influenzaBLineageDistribution[0].YamagataNumberPercent;

        //Non-determined (Index --> 2)
        this.influenzaBLineageDistributionSeries[2][0] = this.influenzaBLineageDistribution[0].NotdeterminedNumber;
        this.influenzaBLineageDistributionSeries[2][1] = this.influenzaBLineageDistribution[0].NotdeterminedNumberPercent;

        this.influenzaBLineageDistributionChart();
      });
  }

  influenzaBLineageDistributionChart() {
    this.influenzaBLineageDistributionOptions = {
      title: {
        text: 'Influenza B Lineage Distribution',
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
            ["B/Victoria", this.influenzaBLineageDistributionSeries[0][0]],
            ["B/Yamagata", 198],
            ["Not-determined", 381]
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
      }
    };

    HC_exporting(Highcharts);
  }

  //#endregion

  //#region Load Chart --> Influenza positiivity overtime
  influenzaPositivityOvertimeData() {
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

    this.influenzaPositivityOvertimeChart();
  }

  influenzaPositivityOvertimeChart() {
    this.influenzaPositivityOvertimeOptions = {
      title: {
        text: 'Number Positive for Influenza by Type, Epiweek and Year',
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
          name: "Influenza B",
          data: [19, 3, 34, 33, 45, 44, 33, 42, 42, 55, 33, 42],
          type: 'column',
          color: "#234FEA",
        },
        {
          showInLegend: true,
          name: "(%) Influenza Positive",
          data: [19, 3, 34, 33, 45, 44, 33, 42, 42, 55, 33, 42],
          type: 'column',
          color: "#FF0000",
        },
        {
          showInLegend: true,
          name: "Influenza Negative",
          data: [19, 3, 34, 33, 45, 44, 33, 42, 42, 55, 33, 42],
          type: 'line',
          color: "#008000",
        },
        {
          showInLegend: true,
          name: "Influenza A",
          data: [19, 3, 34, 33, 45, 44, 33, 42, 42, 55, 33, 42],
          type: 'line',
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
      }
    };

    HC_exporting(Highcharts);
  }
  //#endregion

  //#region Load Chart --> Influenza strains overtime
  influenzaStrainsOvertimeData() {
    for (let index = 0; index < 9; index++) {
      this.influenzaStrainsOvertimeSeries.push([]);

      for (let j = 0; j < 53; j++) {
        this.influenzaStrainsOvertimeSeries[index].push(0);
      }
    }

    this.reviewService.findInfluenzaStrainsOvertime().subscribe(
      response => {
        this.influenzaStrainsOvertime = response;

        //#region Push series data into array at specific indexes
        this.influenzaStrainsOvertime.forEach((dataInstance, index) => {
          // Epi Week (Index --> 0)
          this.influenzaStrainsOvertimeSeries[0][index] = "Week " + dataInstance.EpiWeek;

          // Flu A non-subtypable 2 (Index --> 1)
          this.influenzaStrainsOvertimeSeries[1][index] = dataInstance.NonSubTypableNumber;

          // // Influenza Neg (Index --> 2)
          // this.influenzaStrainsOvertimeSeries[2][index] = 5;
          // this.influenzaStrainsOvertimeSeries[2].push(dataInstance.InfluenzaNeg);

          // // A/H1N1 (Index --> 3)
          // this.influenzaStrainsOvertimeSeries[3].push(dataInstance.AH1N1Number);

          // // A/H3N2 (Index --> 4)
          // this.influenzaStrainsOvertimeSeries[4].push(dataInstance.AH3N2Number);

          // // B/Victoria (Index --> 5)
          // this.influenzaStrainsOvertimeSeries[5].push(dataInstance.VictoriaNumber);

          // // B/Yamagata (Index --> 6)
          // this.influenzaStrainsOvertimeSeries[6].push(dataInstance.YamagataNumber);

          // // Influenza B Not-determined (Index --> 7)
          // this.influenzaStrainsOvertimeSeries[7].push(dataInstance.NotdeterminedNumber);

          // //  Influenza Positive (Index --> 8)
          // this.influenzaStrainsOvertimeSeries[8].push(0);
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
          type: 'column',
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
      }
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
          color: "#FC7500",
        },
        {
          showInLegend: true,
          name: "Percent SARS-COV-2 Positive",
          data: this.influenzaHospitalizationOvertimeSeries[3],
          type: 'spline',
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
      }
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
