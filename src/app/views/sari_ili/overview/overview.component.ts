import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { SARIILIChart } from '../../../models/sari_ili/SARIILIChart.model';
import { SCParent } from '../../../models/sari_ili/SCParent.model';

import * as Highcharts from 'highcharts/highstock';
import HC_exporting from 'highcharts/modules/exporting';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsMap from "highcharts/modules/map"
import HighchartsSolidGauge from 'highcharts/modules/solid-gauge';
import HighchartsTreeMap from 'highcharts/modules/treemap';
import HighchartsTreeGraph from 'highcharts/modules/treegraph';
import topography from '../../../data/world.geojson.json'
import topographyData from '../../../data/afi_pathogen_facility.json'

HighchartsMore(Highcharts);
HighchartsSolidGauge(Highcharts);
HighchartsMap(Highcharts);
HighchartsTreeMap(Highcharts);
HighchartsTreeGraph(Highcharts);

@Component({
  templateUrl: 'overview.component.html',
  styleUrls: ['overview.component.scss']
})

export class SIOverviewComponent implements OnInit {
  //#region Prerequisites
  highcharts = Highcharts;
  CompositeCharts: SCParent = {};
  //#endregion

  constructor(private http: HttpClient) { }

  ngOnInit(): void {

    this.loadCharts();

  }

  loadCharts() {
    //#region Load Chart --> SARI Influenza Cascade
    this.CompositeCharts['influenzaCascade'] = new SARIILIChart(this.http);
    this.CompositeCharts['influenzaCascade'].loadData(
      "overview/influenzaCascade",
      () => {
        let MCTemp = this.CompositeCharts['influenzaCascade'];

        MCTemp.LoadChartOptions();
      },
      () => {
        let MCTemp = this.CompositeCharts['influenzaCascade'];
      },
      () => {
        let MCTemp = this.CompositeCharts['influenzaCascade'];

        MCTemp.ChartOptions = {
          chart: {
            spacingBottom: 30,
            marginRight: 120
          },
          title: {
            align: 'center',
            text: 'SARI Influenza Cascade'
          },
          series: [
            {
              type: 'treegraph',
              keys: ['parent', 'id', 'info'],
              clip: false,
              data: [
                [undefined, 'Screened', 7000],
                ['Screened', 'Eligible', 6809],
                ['Screened', 'Not-Eligible', 0],
                ['Eligible', 'Enrolled', 6809],
                ['Eligible', 'Not-Enrolled', 0],
                ['Enrolled', 'Tested', 6446],
                ['Enrolled', 'Not-Tested', 363],
                ['Tested', 'SARC-COV-2 only', 56],
                ['Tested', 'Influenza only', 657],
                ['Tested', 'Influenza and SARS-COV-2', 1461]
              ],
              marker: {
                symbol: 'circle',
                radius: 6,
                fillColor: '#ffffff',
                lineWidth: 3
              },
              dataLabels: {
                align: 'left',
                pointFormat: '{point.id} ({point.info})',
                style: {
                  color: '#000000',
                  textOutline: '3px #ffffff',
                  whiteSpace: 'nowrap'
                },
                x: 24,
                crop: false,
                overflow: 'none'
              },
              levels: [
                {
                  level: 1,
                  levelIsConstant: false
                },
                {
                  level: 2,
                  colorByPoint: true
                },
                {
                  level: 3,
                  colorByPoint: true,
                },
                {
                  level: 4,
                  colorByPoint: true,
                },
                {
                  level: 5,
                  colorByPoint: true,
                },
                {
                  level: 6,
                  colorByPoint: true,
                  dataLabels: {
                    x: 10
                  },
                  marker: {
                    radius: 4
                  }
                }
              ]
            }
          ],
          credits: {
            enabled: false,
          }
        }
      }
    );
    //#endregion

    //#region Load Chart --> Weekly number of hospitalized ILI & SARI patients and percent ILI & SARI specimens testing positive for influenza and SARS-COV-2
    this.CompositeCharts['findInfluenzaHospitalizationOvertime'] = new SARIILIChart(this.http);
    this.CompositeCharts['findInfluenzaHospitalizationOvertime'].loadData(
      "overview/findInfluenzaHospitalizationOvertime",
      () => {
        let MCTemp = this.CompositeCharts['findInfluenzaHospitalizationOvertime'];
        MCTemp.LoadChartOptions();
      },
      () => {
        let MCTemp = this.CompositeCharts['findInfluenzaHospitalizationOvertime'];

        // Initialize series array
        for (let index = 0; index < 4; index++) {
          MCTemp.ChartSeries.push([]);
        }

        MCTemp.ChartData.forEach(dataInstance => {
          //Compile Epi Week (Index --> 0)
          MCTemp.ChartSeries[0].push(dataInstance.EpiWeek);

          //Compile Samples Tested (Index --> 1)
          MCTemp.ChartSeries[1].push(dataInstance.Tested);

          //Compile Influenza Positive Percent (Index --> 2)
          MCTemp.ChartSeries[2].push(dataInstance.InfluenzaPositivePercent);

          //Compile SARS-COV-2 Positive Percent (Index --> 3)
          MCTemp.ChartSeries[3].push(dataInstance.SARSCOV2PositivePercent);
        });
      },
      () => {
        let MCTemp = this.CompositeCharts['findInfluenzaHospitalizationOvertime'];

        MCTemp.ChartOptions = {
          title: {
            text: 'Weekly number of hospitalized ILI & SARI patients and percent ILI & SARI specimens testing positive for influenza and SARS-COV-2',
            align: 'left'
          },
          chart: {
            type: "column",
          },
          xAxis: {
            categories: MCTemp.ChartSeries[0],
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
              data: MCTemp.ChartSeries[1],
              type: 'column',
              color: "#234FEA",
            },
            {
              showInLegend: true,
              name: "Percent Influenza Positive",
              data: MCTemp.ChartSeries[2],
              type: 'spline',
              yAxis: 1,
              color: "#FFA500",
            },
            {
              showInLegend: true,
              name: "Percent SARS-COV-2 Positive",
              data: MCTemp.ChartSeries[3],
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
          useHighStocks: true,
          credits: {
            enabled: false,
          }
        }
      }
    );
    //#endregion

    //#region Load Chart --> Enrolment by age group (Number of ILI/SARI Patients enrolled by Age Category)
    this.CompositeCharts['enrolledByAgeGroup'] = new SARIILIChart(this.http);
    this.CompositeCharts['enrolledByAgeGroup'].loadData(
      "overview/enrolledByAgeGroup",
      () => {
        let MCTemp = this.CompositeCharts['enrolledByAgeGroup'];

        MCTemp.LoadChartOptions();
      },
      () => {
        let MCTemp = this.CompositeCharts['enrolledByAgeGroup'];

        // Age Group (Index --> 0)
        MCTemp.ChartSeries.push([]);

        // Enrolled Number (Index --> 1)
        MCTemp.ChartSeries.push([]);

        // Enrolled Percentage (Index --> 2)
        MCTemp.ChartSeries.push([]);

        MCTemp.ChartData.forEach((dataInstance) => {
          MCTemp.ChartSeries[0].push(dataInstance.AgeCategory);
          MCTemp.ChartSeries[1].push(dataInstance.EnrolledNumber);
          MCTemp.ChartSeries[2].push(dataInstance.EnrolledPercentage);
        });
      },
      () => {
        let MCTemp = this.CompositeCharts['enrolledByAgeGroup'];

        MCTemp.ChartOptions = {
          title: {
            text: 'Number of ILI/SARI Patients enrolled by Age Category',
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
                text: 'Number Enrolled',
              },
              labels: {
                format: '{value}', //TODO! Format to remove netagive values
              },
              accessibility: {
                description: 'Number',
                rangeDescription: 'Range: 0 to 5%',
              }
            },
            {
              title: {
                text: 'Percentage Enrolled',
              },
              opposite: true
            }
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
              name: 'Enrolled Number',
              data: MCTemp.ChartSeries[1],
              color: '#234FEA',
            },
            {
              name: 'Enrolled Percentage',
              data: MCTemp.ChartSeries[2],
              color: '#FFA500',
              type: "spline",
              yAxis: 1
            }
          ],
          credits: {
            enabled: false,
          }
        }
      }
    );
    //#endregion

    //#region Load Chart --> Influenza Patient Outcome
    this.CompositeCharts['findInfluenzaPatientOutcome'] = new SARIILIChart(this.http);
    this.CompositeCharts['findInfluenzaPatientOutcome'].loadData(
      "overview/findInfluenzaPatientOutcome",
      () => {
        let MCTemp = this.CompositeCharts['findInfluenzaPatientOutcome'];

        for (let index = 0; index < 6; index++) {
          MCTemp.ChartSeries.push([]);
          MCTemp.ChartSeries[index].push(0);
          MCTemp.ChartSeries[index].push(0);
        }

        MCTemp.LoadChartOptions();
      },
      () => {
        let MCTemp = this.CompositeCharts['findInfluenzaPatientOutcome'];

        //Absconded (Index --> 0)
        MCTemp.ChartSeries[0][0] = MCTemp.ChartData[0].AbscondedNumber;
        MCTemp.ChartSeries[0][1] = MCTemp.ChartData[0].AbscondedPercentage;

        //Death (Index --> 1)
        MCTemp.ChartSeries[1][0] = MCTemp.ChartData[0].DeathNumber;
        MCTemp.ChartSeries[1][1] = MCTemp.ChartData[0].DeathPercentage;

        //Discharged from hospital alive (Index --> 2)
        MCTemp.ChartSeries[2][0] = MCTemp.ChartData[0].DischargedFromHospital;
        MCTemp.ChartSeries[2][1] = MCTemp.ChartData[0].DischargedFromHospitalPercentage;

        //Reffered to another facility (Index --> 3)
        MCTemp.ChartSeries[3][0] = MCTemp.ChartData[0].RefferedToAnotherFacilityNumber;
        MCTemp.ChartSeries[3][1] = MCTemp.ChartData[0].RefferedToAnotherFacilityPercentage;

        //Refused hospital treatment (Index --> 4)
        MCTemp.ChartSeries[4][0] = MCTemp.ChartData[0].RefusedHospitalTreatment;
        MCTemp.ChartSeries[4][1] = MCTemp.ChartData[0].RefusedHospitalTreatmentPercentage;

        //Total (Index --> 5)
        MCTemp.ChartSeries[5][0] = MCTemp.ChartData[0].TotalOutcome;
      },
      () => {
        let MCTemp = this.CompositeCharts['findInfluenzaPatientOutcome'];

        MCTemp.ChartOptions = {
          title: {
            text: 'Patient Outcome',
            align: 'left'
          },
          chart: {
            type: "pie",
          },
          colors: [
            "#FFA500",
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
                ["Death (" + MCTemp.ChartSeries[0][1] + "%)", MCTemp.ChartSeries[0][0]],
                ["Absconded (" + MCTemp.ChartSeries[1][1] + "%)", MCTemp.ChartSeries[1][0]],
                ["Discharged from Hospital Alive (" + MCTemp.ChartSeries[2][1] + "%)", MCTemp.ChartSeries[2][0]],
                ["Referred to another facility (" + MCTemp.ChartSeries[3][1] + "%)", MCTemp.ChartSeries[3][0]],
                ["Refused hospital treatment (" + MCTemp.ChartSeries[4][1] + "%)", MCTemp.ChartSeries[4][0]]
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

    //Deprecated ************************* Start

    //#region Load Chart --> Influenza Types Distribution
    this.CompositeCharts['findTypesByDistribution'] = new SARIILIChart(this.http);
    this.CompositeCharts['findTypesByDistribution'].loadData(
      "overview/findTypesByDistribution",
      () => {
        let MCTemp = this.CompositeCharts['findTypesByDistribution'];

        for (let index = 0; index < 5; index++) {
          MCTemp.ChartSeries.push([]);
          MCTemp.ChartSeries[index].push(0);
          MCTemp.ChartSeries[index].push(0);
        }

        MCTemp.LoadChartOptions();
      },
      () => {
        let MCTemp = this.CompositeCharts['findTypesByDistribution'];

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
        let MCTemp = this.CompositeCharts['findTypesByDistribution'];

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
          },
          credits: {
            enabled: false,
          }
        }
      }
    );
    //#endregion

    //#region Load Chart --> Influenza A Subtype Distribution
    this.CompositeCharts['findInfluenzaASubtypesDistribution'] = new SARIILIChart(this.http);
    this.CompositeCharts['findInfluenzaASubtypesDistribution'].loadData(
      "overview/findInfluenzaASubtypesDistribution",
      () => {
        let MCTemp = this.CompositeCharts['findInfluenzaASubtypesDistribution'];

        for (let index = 0; index < 5; index++) {
          MCTemp.ChartSeries.push([]);
          MCTemp.ChartSeries[index].push(0);
          MCTemp.ChartSeries[index].push(0);
        }
        MCTemp.LoadChartOptions();
      },
      () => {
        let MCTemp = this.CompositeCharts['findInfluenzaASubtypesDistribution'];

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
        let MCTemp = this.CompositeCharts['findInfluenzaASubtypesDistribution'];

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
            "#FFA500", // Color for Category 2
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
          },
          credits: {
            enabled: false,
          }
        }
      }
    );
    //#endregion    

    //#region Load Chart --> Influenza B Lineage Distribution
    this.CompositeCharts['findInfluenzaBLineageDistribution'] = new SARIILIChart(this.http);
    this.CompositeCharts['findInfluenzaBLineageDistribution'].loadData(
      "overview/findInfluenzaBLineageDistribution",
      () => {
        let MCTemp = this.CompositeCharts['findInfluenzaBLineageDistribution'];

        for (let index = 0; index < 3; index++) {
          MCTemp.ChartSeries.push([]);
          MCTemp.ChartSeries[index].push(0);
          MCTemp.ChartSeries[index].push(0);
        }
        MCTemp.LoadChartOptions();
      },
      () => {
        let MCTemp = this.CompositeCharts['findInfluenzaBLineageDistribution'];

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
        let MCTemp = this.CompositeCharts['findInfluenzaBLineageDistribution'];

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
          },
          credits: {
            enabled: false,
          }
        }
      }
    );
    //#endregion

    //#region Load Chart --> Overall SARS-COV-2 Positivity
    this.CompositeCharts['findOverallSARSCOV2Positivity'] = new SARIILIChart(this.http);
    this.CompositeCharts['findOverallSARSCOV2Positivity'].loadData(
      "overview/findOverallSARSCOV2Positivity",
      () => {
        let MCTemp = this.CompositeCharts['findOverallSARSCOV2Positivity'];

        for (let index = 0; index < 2; index++) {
          MCTemp.ChartSeries.push([]);
          MCTemp.ChartSeries[index].push(0);
          MCTemp.ChartSeries[index].push(0);
        }
        MCTemp.LoadChartOptions();
      },
      () => {
        let MCTemp = this.CompositeCharts['findOverallSARSCOV2Positivity'];

        //Positive (Index --> 0)
        MCTemp.ChartSeries[0][0] = MCTemp.ChartData[0].CovidPositiveNumber;
        MCTemp.ChartSeries[0][1] = MCTemp.ChartData[0].CovidPositiveNumberPercent;

        //Negative (Index --> 0)
        MCTemp.ChartSeries[1][0] = MCTemp.ChartData[0].CovidNegativeNumber;
        MCTemp.ChartSeries[1][1] = MCTemp.ChartData[0].CovidNegativeNumberPercent;
      },
      () => {
        let MCTemp = this.CompositeCharts['findOverallSARSCOV2Positivity'];

        MCTemp.ChartOptions = {
          title: {
            text: 'Overall SARS-COV-2 Positivity',
            align: 'left'
          },
          chart: {
            type: "pie",
          },
          colors: [
            "#234FEA", // Color for Category 1
            "#FFA500", // Color for Category 2
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
            },
          },
          credits: {
            enabled: false,
          }
        }
      }
    );
    //#endregion

    //#region Load Chart --> SARS-COV-2 Positivity over time
    this.CompositeCharts['findSARSCOV2PositivityOvertime'] = new SARIILIChart(this.http);
    this.CompositeCharts['findSARSCOV2PositivityOvertime'].loadData(
      "overview/findSARSCOV2PositivityOvertime",
      () => {
        let MCTemp = this.CompositeCharts['findSARSCOV2PositivityOvertime'];
        MCTemp.LoadChartOptions();
      },
      () => {
        let MCTemp = this.CompositeCharts['findSARSCOV2PositivityOvertime'];

        // Initialize series array
        for (let index = 0; index < 2; index++) {
          MCTemp.ChartSeries.push([]);
        }

        MCTemp.ChartData.forEach(dataInstance => {
          //Compile EpiWeek (Index --> 0)
          MCTemp.ChartSeries[0].push(dataInstance.EPIWeek);

          //Compile Percent Positive (Index --> 1)
          MCTemp.ChartSeries[1].push(dataInstance.Covid19PositivePercent);
        });
      },
      () => {
        let MCTemp = this.CompositeCharts['findSARSCOV2PositivityOvertime'];

        MCTemp.ChartOptions = {
          title: {
            text: 'SARS-COV-2 Positivity over time',
            align: 'left'
          },
          chart: {
            type: "spline"
          },
          xAxis: {
            categories: MCTemp.ChartSeries[0],
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
              data: MCTemp.ChartSeries[1],
              color: "#234FEA",
            }
          ],
          plotOptions: {
            spline: {
              stacking: 'normal',
              dataLabels: {
                enabled: true,
                useHTML: true,
                format: "<span style='color: #000'>{y}%</span>"
              }
            }
          },
          useHighStocks: true,
          credits: {
            enabled: false,
          }
        }
      }
    );
    //#endregion

    //#region Load Chart --> Influenza positivity by type overtime
    this.CompositeCharts['findInfluenzaPositivityByTypeOvertime'] = new SARIILIChart(this.http);
    this.CompositeCharts['findInfluenzaPositivityByTypeOvertime'].loadData(
      "overview/findInfluenzaPositivityByTypeOvertime",
      () => {
        let MCTemp = this.CompositeCharts['findInfluenzaPositivityByTypeOvertime'];
        MCTemp.LoadChartOptions();
      },
      () => {
        let MCTemp = this.CompositeCharts['findInfluenzaPositivityByTypeOvertime'];

        // Initialize series array
        for (let index = 0; index < 5; index++) {
          MCTemp.ChartSeries.push([]);
        }

        MCTemp.ChartData.forEach(dataInstance => {
          //Compile Epi Week (Index --> 0)
          MCTemp.ChartSeries[0].push(dataInstance.EpiWeek);

          //Compile Influenza A Positive (Index --> 1)
          MCTemp.ChartSeries[1].push(dataInstance.InfluenzaAPositiveNumber);

          //Compile Influenza B Positive (Index --> 2)
          MCTemp.ChartSeries[2].push(dataInstance.InfluenzaBPositiveNumber);

          //Compile Influenza Positive Percentage (Index --> 3)
          MCTemp.ChartSeries[3].push(dataInstance.InfluenzaPositivePercentage);

          //Compile Influenza Negative (Index --> 4)
          MCTemp.ChartSeries[4].push(dataInstance.InfluenzaNegativeNumber);
        });
      },
      () => {
        let MCTemp = this.CompositeCharts['findInfluenzaPositivityByTypeOvertime'];

        MCTemp.ChartOptions = {
          title: {
            text: 'Number positive for influenza by type and epiweek',
            align: 'left'
          },
          chart: {
            type: "column",
          },
          xAxis: {
            categories: MCTemp.ChartSeries[0],
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
              data: MCTemp.ChartSeries[1],
              type: 'column',
              color: "#FFA500",
            },
            {
              showInLegend: true,
              name: "Influenza B Positive",
              data: MCTemp.ChartSeries[2],
              type: 'column',
              color: "#234FEA",
            },
            {
              showInLegend: true,
              name: "Influenza Positive (%)",
              data: MCTemp.ChartSeries[3],
              type: 'spline',
              yAxis: 1,
              color: "#FF0000",
            },
            {
              showInLegend: true,
              name: "Influenza Negative",
              data: MCTemp.ChartSeries[4],
              type: 'column',
              color: "#008000",
            }
          ],
          plotOptions: {
            column: {
              stacking: 'normal',
              dataLabels: {
                enabled: false
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
          useHighStocks: true,
          credits: {
            enabled: false,
          }
        }
      }
    );
    //#endregion

    //#region Load Chart --> Influenza strains overtime
    this.CompositeCharts['findInfluenzaStrainsOvertime'] = new SARIILIChart(this.http);
    this.CompositeCharts['findInfluenzaStrainsOvertime'].loadData(
      "overview/findInfluenzaStrainsOvertime",
      () => {
        let MCTemp = this.CompositeCharts['findInfluenzaStrainsOvertime'];
        MCTemp.LoadChartOptions();
      },
      () => {
        let MCTemp = this.CompositeCharts['findInfluenzaStrainsOvertime'];

        // Initialize series array
        for (let index = 0; index < 9; index++) {
          MCTemp.ChartSeries.push([]);
        }

        MCTemp.ChartData.forEach(dataInstance => {
          // Epi Week (Index --> 0)
          MCTemp.ChartSeries[0].push(dataInstance.EpiWeek);

          // Flu A non-subtypable 2 (Index --> 1)
          MCTemp.ChartSeries[1].push(dataInstance.NonSubTypableNumber);

          // Influenza Neg (Index --> 2)
          MCTemp.ChartSeries[2].push(dataInstance.InfluenzaNeg);

          // A/H1N1 (Index --> 3)
          MCTemp.ChartSeries[3].push(dataInstance.AH1N1Number);

          // A/H3N2 (Index --> 4)
          MCTemp.ChartSeries[4].push(dataInstance.AH3N2Number);

          // B/Victoria (Index --> 5)
          MCTemp.ChartSeries[5].push(dataInstance.VictoriaNumber);

          // B/Yamagata (Index --> 6)
          MCTemp.ChartSeries[6].push(dataInstance.YamagataNumber);

          // Influenza B Not-determined (Index --> 7)
          MCTemp.ChartSeries[7].push(dataInstance.NotdeterminedNumber);

          // Influenza Positive (Index --> 8)
          MCTemp.ChartSeries[8].push(0);
        });
      },
      () => {
        let MCTemp = this.CompositeCharts['findInfluenzaStrainsOvertime'];

        MCTemp.ChartOptions = {
          title: {
            text: 'Circulating Strains of Influenza Virus over time',
            align: 'left'
          },
          chart: {
            type: "column",
          },
          xAxis: {
            categories: MCTemp.ChartSeries[0],
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
              data: MCTemp.ChartSeries[1],
              type: 'column',
              color: "#234FEA",
            },
            {
              showInLegend: true,
              name: "Influenza Neg",
              data: MCTemp.ChartSeries[2],
              type: 'column',
              color: "#008000",
            },
            {
              showInLegend: true,
              name: "A/H1N1",
              data: MCTemp.ChartSeries[3],
              type: 'column',
              color: "#FF0000",
            },
            {
              showInLegend: true,
              name: "A/H3N2",
              data: MCTemp.ChartSeries[4],
              type: 'column',
              color: "#66B3FF",
            },
            {
              showInLegend: true,
              name: "B/Victoria",
              data: MCTemp.ChartSeries[5],
              type: 'column',
              color: "#FFB3E6",
            },
            {
              showInLegend: true,
              name: "B/Yamagata",
              data: MCTemp.ChartSeries[6],
              type: 'column',
              color: "#CCB3FF",
            },
            {
              showInLegend: true,
              name: "Influenza B Not-determined",
              data: MCTemp.ChartSeries[7],
              type: 'column',
              color: "#B3FFB3",
            },
            {
              showInLegend: true,
              name: " Influenza Positive",
              data: MCTemp.ChartSeries[8],
              type: 'spline',
              yAxis: 1,
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
          useHighStocks: true,
          credits: {
            enabled: false,
          }
        }
      }
    );
    //#endregion

    //#region Load Chart --> Geographic distribution by health facility
    this.CompositeCharts['geographicDistributionByFacility'] = new SARIILIChart(this.http);
    this.CompositeCharts['geographicDistributionByFacility'].loadData(
      "overview/geographicDistributionByFacility",
      () => {
        let MCTemp = this.CompositeCharts['geographicDistributionByFacility'];

        for (let index = 0; index < 2; index++) {
          MCTemp.ChartSeries.push([]);
          MCTemp.ChartSeries[index].push(Math.floor(Math.random() * 1000));
          MCTemp.ChartSeries[index].push(0);
        }

        MCTemp.LoadChartOptions();
      },
      () => {
        let MCTemp = this.CompositeCharts['geographicDistributionByFacility'];
      },
      () => {
        let MCTemp = this.CompositeCharts['geographicDistributionByFacility'];

        MCTemp.ChartOptions = {
          chart: {
            type: "map",
            map: topography
          },
          title: {
            text: 'Geographical distribution by health facility'
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

        let TempChart = new Highcharts.MapChart('geographicDistributionByFacility', MCTemp.ChartOptions);
      }
    );
    //#endregion

    //Deprecated ************************* End

    HC_exporting(Highcharts);

  }
}