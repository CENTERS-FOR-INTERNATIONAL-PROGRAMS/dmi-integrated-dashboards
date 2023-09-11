import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Chart } from '../../../models/sari_ili/Chart.model';
import { ChartParent } from '../../../models/sari_ili/ChartParent.model';
import { IDFilter } from '../../../models/IDFilter.model';
import { APIReader } from '../../../models/APIReader.model';
import { IDFacility } from '../../../models/IDFacility.model';
import { GroupedCategory } from '../../../models/GroupedCategory.model';

import * as Highcharts from 'highcharts';
import * as Highstock from 'highcharts/highstock';
import HighchartsMap from "highcharts/modules/map"
import HighchartsTreeMap from 'highcharts/modules/treemap';
import HighchartsTreeGraph from 'highcharts/modules/treegraph';

HighchartsMap(Highcharts);
HighchartsTreeMap(Highcharts);
HighchartsTreeGraph(Highcharts);

@Component({
  templateUrl: 'overview.component.html',
  styleUrls: ['overview.component.scss']
})

export class SIOverviewComponent implements OnInit {
  //#region Properties
  protected highcharts = Highcharts;
  protected highstock = Highstock;
  protected CompositeCharts: ChartParent = {};

  protected APIReaderInstance = new APIReader(this.http);
  protected DataFilterInstance = new IDFilter();
  protected CompositeFacilities: any[] = [];
  //#endregion

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadFilters();
    this.loadCharts();
  }

  formatLabel(value: number): string {
    return `${value}`;
  }

  loadFilters() {
    //#region Acquire composite facilities
    this.APIReaderInstance.loadData("sari_ili/acquireCompositeFacilities", () => {
      this.APIReaderInstance.CompositeData.forEach((dataInstance: any) => {
        this.CompositeFacilities.push(new IDFacility(
          dataInstance['FacilityId'],
          dataInstance['FacilityCode'],
          dataInstance['FacilityName']));
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
    //#region Load Chart --> SARI Influenza Cascade
    this.CompositeCharts['influenzaCascade'] = new Chart(this.http);
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
    this.CompositeCharts['findInfluenzaHospitalizationOvertime'] = new Chart(this.http);
    this.CompositeCharts['findInfluenzaHospitalizationOvertime'].loadData(
      "overview/findInfluenzaHospitalizationOvertime",
      () => {
        let MCTemp = this.CompositeCharts['findInfluenzaHospitalizationOvertime'];
        MCTemp.LoadChartOptions();
      },
      () => {
        // Prerequisites
        let MCTemp = this.CompositeCharts['findInfluenzaHospitalizationOvertime'];
        let GCPeriod: GroupedCategory[] = [];
        let GCInstance = new GroupedCategory("", []);

        // Reset
        MCTemp.ChartSeries = [];

        // Initialize series array
        for (let index = 0; index < 5; index++) {
          MCTemp.ChartSeries.push([]);
        }

        MCTemp.ChartData.forEach(dataInstance => {
          //Compile Epi Week (Index --> 0)
          MCTemp.ChartSeries[0].push("Week " + dataInstance.EpiWeek);

          //Compile Samples Tested (Index --> 1)
          MCTemp.ChartSeries[1].push(dataInstance.TestedNumber);

          //Compile Influenza Positive Percent (Index --> 2)
          MCTemp.ChartSeries[2].push(dataInstance.InfluenzaPositivePercent);

          //Compile SARS-COV-2 Positive Percent (Index --> 3)
          MCTemp.ChartSeries[3].push(dataInstance.SARSCOV2PositivePercent);

          //Compile grouped category
          let gc_year_index = GCInstance.attach(GCPeriod, "" + dataInstance.Year + "", false);
          let gc_month_index = GCInstance.attach(GCPeriod[gc_year_index].categories, dataInstance.EpiWeek, true);
          // let gc_epiweek_index = GCInstance.attach(GCPeriod[gc_year_index].categories[gc_month_index].categories, dataInstance.EpiWeek, true);
        });

        // Period (index --> 4)
        MCTemp.ChartSeries[4] = JSON.parse(JSON.stringify(GCPeriod));
      },
      () => {
        let MCTemp = this.CompositeCharts['findInfluenzaHospitalizationOvertime'];

        MCTemp.ChartOptions = {
          title: {
            text: 'Figure 2 :Weekly number of hospitalized SARI patients, and % ILI & SARI specimens testing positive for influenza & SARS-C0V-2',
            align: 'left'
          },
          chart: {
            type: "column",
          },
          xAxis: {
            name: "Period",
            title: { text: "Period (Year, Epi Week)" },
            tickWidth: 1,
            labels: {
              y: 18,
              groupedOptions: [{
                y: 10,
              }, {
                y: 10
              }]
            },
            min: 0,
            max: 22,
            scrollbar: {
              enabled: true
            },
            categories: MCTemp.ChartSeries[4]
          },
          yAxis: [{
            title: {
              text: "Number tested or virus detected",
            }
          },
          {
            title: {
              text: "SARS-COV-2 Positive Percent",
            },
            labels: {
              format: '{value}%',
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
          credits: {
            enabled: false,
          }
        }
      }
    );
    //#endregion

    //#region Load Chart --> Enrolment by age group (Number of ILI/SARI Patients enrolled by Age Category)
    this.CompositeCharts['enrolledByAgeGroup'] = new Chart(this.http);
    this.CompositeCharts['enrolledByAgeGroup'].loadData(
      "influenza/enrolledByAgeGroup",
      () => {
        let MCTemp = this.CompositeCharts['enrolledByAgeGroup'];

        MCTemp.LoadChartOptions();
      },
      () => {
        // Prerequisites
        let MCTemp = this.CompositeCharts['enrolledByAgeGroup'];
        MCTemp.ChartSeries = [];

        // Series
        MCTemp.ChartSeries.push([]);

        MCTemp.ChartData.forEach((dataInstance) => {
          if (dataInstance.AgeGroupCategory != null) {
            MCTemp.ChartSeries[0].push(
              [dataInstance.AgeGroupCategory + " " + dataInstance.EnrolledNumber + " (" + dataInstance.EnrolledPercent + "%)", dataInstance.EnrolledNumber]
            );
          }
        });
      },
      () => {
        let MCTemp = this.CompositeCharts['enrolledByAgeGroup'];

        MCTemp.ChartOptions = {
          title: {
            text: 'Figure 3: Number of ILI/SARI Patients enrolled by Age Category',
            align: 'left',
          },
          chart: {
            type: 'pie',
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
                format: '{value}',
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
              labels: {
                format: '{value}%',
              },
              opposite: true
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
          legend: { align: 'left', verticalAlign: 'bottom', y: 0, x: 80 },
          tooltip: {
            format:
              '<b>{series.name}, {point.category}, {y}</b>'
          },
          series: [
            {
              name: "Data",
              type: 'pie',
              showInLegend: true,
              data: MCTemp.ChartSeries[0]
            }
          ],
          credits: {
            enabled: false,
          }
        }
      }
    );
    //#endregion

    //#region Load Chart --> SARI Patient Outcome
    this.CompositeCharts['findInfluenzaPatientOutcome'] = new Chart(this.http);
    this.CompositeCharts['findInfluenzaPatientOutcome'].loadData(
      "overview/SARIPatientOutcome",
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
        MCTemp.ChartSeries[0][1] = MCTemp.ChartData[0].AbscondedPercent;

        //Death (Index --> 1)
        MCTemp.ChartSeries[1][0] = MCTemp.ChartData[0].DeathNumber;
        MCTemp.ChartSeries[1][1] = MCTemp.ChartData[0].DeathPercent;

        //Discharged from hospital alive (Index --> 2)
        MCTemp.ChartSeries[2][0] = MCTemp.ChartData[0].DischargedFromHospitalNumber;
        MCTemp.ChartSeries[2][1] = MCTemp.ChartData[0].DischargedFromHospitalPercent;

        //Referred to another facility (Index --> 3)
        MCTemp.ChartSeries[3][0] = MCTemp.ChartData[0].ReferredToAnotherFacilityNumber;
        MCTemp.ChartSeries[3][1] = MCTemp.ChartData[0].ReferredToAnotherFacilityPercent;

        //Refused hospital treatment (Index --> 4)
        MCTemp.ChartSeries[4][0] = MCTemp.ChartData[0].RefusedHospitalTreatmentNumber;
        MCTemp.ChartSeries[4][1] = MCTemp.ChartData[0].RefusedHospitalTreatmentPercent;

        //Total (Index --> 5)
        MCTemp.ChartSeries[5][0] = MCTemp.ChartData[0].TotalOutcome;
      },
      () => {
        let MCTemp = this.CompositeCharts['findInfluenzaPatientOutcome'];

        MCTemp.ChartOptions = {
          title: {
            text: 'Figure 4: Patient Outcome',
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
              showInLegend: true,
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
  }

}