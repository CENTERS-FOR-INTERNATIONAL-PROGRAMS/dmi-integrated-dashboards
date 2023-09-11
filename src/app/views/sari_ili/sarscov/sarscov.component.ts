import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Chart } from '../../../models/sari_ili/Chart.model';
import { ChartParent } from '../../../models/sari_ili/ChartParent.model';
import { IDFilter } from '../../../models/IDFilter.model';
import { APIReader } from '../../../models/APIReader.model';
import { IDFacility } from '../../../models/IDFacility.model';
import { GroupedCategory } from '../../../models/GroupedCategory.model';

import * as Highcharts from 'highcharts/highstock';
import HC_exporting from 'highcharts/modules/exporting';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsMap from "highcharts/modules/map"
import HighchartsSolidGauge from 'highcharts/modules/solid-gauge';
import HighchartsTreeMap from 'highcharts/modules/treemap';
import HighchartsTreeGraph from 'highcharts/modules/treegraph';

HighchartsMore(Highcharts);
HighchartsSolidGauge(Highcharts);
HighchartsMap(Highcharts);
HighchartsTreeMap(Highcharts);
HighchartsTreeGraph(Highcharts);

@Component({
  templateUrl: 'sarscov.component.html',
  styleUrls: ['sarscov.component.scss']
})

export class SARSCOV2Component implements OnInit {
  //#region Prerequisites
  highcharts = Highcharts;
  CompositeCharts: ChartParent = {};

  APIReaderInstance = new APIReader(this.http);
  DataFilterInstance = new IDFilter();
  CompositeFacilities: any[] = [];
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
    //#region Load Chart --> ILI & SARI SARS-COV-2 Cascade
    this.CompositeCharts['influenzaCascade'] = new Chart(this.http);
    this.CompositeCharts['influenzaCascade'].loadData(
      "sarscov/influenzaCascade",
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
            text: 'ILI & SARI SARS-COV-2 Cascade'
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
                ['Tested', 'Negative', 13453],
                ['Tested', 'Positive', 1064]
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

    //#region Load Chart --> Tested for SARS-COV-2 by Age Group
    this.CompositeCharts['testedByAgeGroup'] = new Chart(this.http);
    this.CompositeCharts['testedByAgeGroup'].loadData(
      "sarscov/testedByAgeGroup",
      () => {
        let MCTemp = this.CompositeCharts['testedByAgeGroup'];

        MCTemp.LoadChartOptions();
      },
      () => {
        // Prerequisites
        let MCTemp = this.CompositeCharts['testedByAgeGroup'];
        MCTemp.ChartSeries = [];

        // Reset
        MCTemp.ChartSeries = [];

        // Series
        MCTemp.ChartSeries.push([]);

        MCTemp.ChartData.forEach((dataInstance) => {
          if (dataInstance.AgeGroupCategory != null) {
            MCTemp.ChartSeries[0].push(
              [
                dataInstance.AgeGroupCategory + ", " + dataInstance.SARSCOV2TestedNumber + " (" + dataInstance.SARSCOV2TestedPercent + "%)",
                dataInstance.SARSCOV2TestedNumber
              ]
            );
          }
        });
      },
      () => {
        let MCTemp = this.CompositeCharts['testedByAgeGroup'];

        MCTemp.ChartOptions = {
          title: {
            text: 'Figure 16: Tested for SARS-COV-2 by Age Group',
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

    //#region Load Chart --> SARS-COV-2 Positive Distribution by Age Category
    this.CompositeCharts['positiveDistributionByAgeGroup'] = new Chart(this.http);
    this.CompositeCharts['positiveDistributionByAgeGroup'].loadData(
      "sarscov/positiveDistributionByAgeGroup",
      () => {
        let MCTemp = this.CompositeCharts['positiveDistributionByAgeGroup'];

        MCTemp.LoadChartOptions();
      },
      () => {
        // Prerequisites
        let MCTemp = this.CompositeCharts['positiveDistributionByAgeGroup'];
        MCTemp.ChartSeries = [];

        // Reset
        MCTemp.ChartSeries = [];

        // Series
        MCTemp.ChartSeries.push([]);

        MCTemp.ChartData.forEach((dataInstance) => {
          if (dataInstance.AgeGroupCategory != null) {
            MCTemp.ChartSeries[0].push(
              [
                dataInstance.AgeGroupCategory + ", " + dataInstance.SARSCOV2PositiveNumber + " (" + dataInstance.SARSCOV2PositivePercent + "%)",
                dataInstance.SARSCOV2PositiveNumber
              ]
            );
          }
        });
      },
      () => {
        let MCTemp = this.CompositeCharts['positiveDistributionByAgeGroup'];

        MCTemp.ChartOptions = {
          title: {
            text: 'Figure 17: SARS-CoV-2 Positive Distribution by Age Category',
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

    //#region Load Chart --> Number of Speciment Tested and % Positive for SARS-COV-2 by Epi Week
    this.CompositeCharts['SARSCOV2PositiveByEpiWeek'] = new Chart(this.http);
    this.CompositeCharts['SARSCOV2PositiveByEpiWeek'].loadData(
      "sarscov/SARSCOV2PositiveOvertime",
      () => {
        let MCTemp = this.CompositeCharts['SARSCOV2PositiveByEpiWeek'];
        MCTemp.LoadChartOptions();
      },
      () => {
        // Prerequisites
        let MCTemp = this.CompositeCharts['SARSCOV2PositiveByEpiWeek'];
        let GCPeriod: GroupedCategory[] = [];
        let GCInstance = new GroupedCategory("", []);

        // Reset
        MCTemp.ChartSeries = [];

        // Initialize series array
        for (let index = 0; index < 4; index++) {
          MCTemp.ChartSeries.push([]);
        }

        MCTemp.ChartData.forEach(dataInstance => {
          //Compile Epi Week (Index --> 0)
          MCTemp.ChartSeries[0].push(dataInstance.EpiWeek);

          //Compile Covid Tested Number (Index --> 1)
          MCTemp.ChartSeries[1].push(dataInstance.SARSCOV2TestedNumber);

          //Compile SARS-COV-2 Positive Percentage (Index --> 2)
          MCTemp.ChartSeries[2].push(dataInstance.SARSCOV2PositivePercent);

          //Compile period
          let gc_year_index = GCInstance.attach(GCPeriod, dataInstance.Year, false);
          let gc_month_index = GCInstance.attach(GCPeriod[gc_year_index].categories, dataInstance.Month, false);
          let gc_epiweek_index = GCInstance.attach(GCPeriod[gc_year_index].categories[gc_month_index].categories, dataInstance.EpiWeek, true);
        });

        // Period (index --> 3)
        MCTemp.ChartSeries[3] = JSON.parse(JSON.stringify(GCPeriod));
      },
      () => {
        let MCTemp = this.CompositeCharts['SARSCOV2PositiveByEpiWeek'];

        MCTemp.ChartOptions = {
          title: {
            text: 'Figure 18: Number of Speciment Tested and % Positive for SARS-COV-2 by Epi Week',
            align: 'left'
          },
          chart: {
            type: "column",
          },
          xAxis: {
            name: "Period",
            title: { text: "Period (Year, Month, Epi Week)" },
            tickWidth: 1,
            min: 0,
            max: 22,
            scrollbar: {
              enabled: true
            },
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
          yAxis: [{
            title: {
              text: "Number tested for Covid",
            }
          },
          {
            title: {
              text: "(%) SARS-COV-2 Positive",
              rotation: 270,
            },
            labels: {
              format: '{value}%',
            },
            opposite: true
          }],
          series: [
            {
              showInLegend: true,
              name: "Tested for Covid",
              data: MCTemp.ChartSeries[1],
              type: 'column',
              color: "#234FEA"
            },
            {
              showInLegend: true,
              name: "Percentage SARS-COV-2 Positive",
              data: MCTemp.ChartSeries[2],
              type: 'spline',
              yAxis: 1,
              color: "#FF0000"
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

    //#region Load Chart --> Number of Speciment Tested and % Positive for SARS-COV-2 by Year
    this.CompositeCharts['SARSCOV2PositiveByYear'] = new Chart(this.http);
    this.CompositeCharts['SARSCOV2PositiveByYear'].loadData(
      "sarscov/SARSCOV2PositiveOvertime",
      () => {
        let MCTemp = this.CompositeCharts['SARSCOV2PositiveByYear'];
        MCTemp.LoadChartOptions();
      },
      () => {
        // Prerequisites
        let MCTemp = this.CompositeCharts['SARSCOV2PositiveByYear'];
        let GCPeriod: GroupedCategory[] = [];
        let GCInstance = new GroupedCategory("", []);

        // Reset
        MCTemp.ChartSeries = [];

        // Initialize series array
        for (let index = 0; index < 4; index++) {
          MCTemp.ChartSeries.push([]);
        }

        MCTemp.ChartData.forEach(dataInstance => {
          //Compile Epi Week (Index --> 0)
          MCTemp.ChartSeries[0].push(dataInstance.EpiWeek);

          //Compile Covid Tested Number (Index --> 1)
          MCTemp.ChartSeries[1].push(dataInstance.SARSCOV2TestedNumber);

          //Compile SARS-COV-2 Positive Percentage (Index --> 2)
          MCTemp.ChartSeries[2].push(dataInstance.SARSCOV2PositivePercent);

          //Compile period
          let gc_year_index = GCInstance.attach(GCPeriod, dataInstance.Year, false);
          let gc_month_index = GCInstance.attach(GCPeriod[gc_year_index].categories, dataInstance.Month, false);
          let gc_epiweek_index = GCInstance.attach(GCPeriod[gc_year_index].categories[gc_month_index].categories, dataInstance.EpiWeek, true);
        });

        // Period (index --> 3)
        MCTemp.ChartSeries[3] = JSON.parse(JSON.stringify(GCPeriod));
      },
      () => {
        let MCTemp = this.CompositeCharts['SARSCOV2PositiveByYear'];

        MCTemp.ChartOptions = {
          title: {
            text: 'Figure 19: Number of Speciment Tested and % Positive for SARS-COV-2 by Year',
            align: 'left'
          },
          chart: {
            type: "column",
          },
          xAxis: {
            name: "Period",
            title: { text: "Period (Year, Month, Epi Week)" },
            tickWidth: 1,
            min: 0,
            max: 22,
            scrollbar: {
              enabled: true
            },
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
          yAxis: [{
            title: {
              text: "Number tested for Covid",
            }
          },
          {
            title: {
              text: "(%) SARS-COV-2 Positive",
              rotation: 270,
            },
            labels: {
              format: '{value}%',
            },
            opposite: true
          }],
          series: [
            {
              showInLegend: true,
              name: "Tested for Covid",
              data: MCTemp.ChartSeries[1],
              type: 'column',
              color: "#234FEA"
            },
            {
              showInLegend: true,
              name: "Percentage SARS-COV-2 Positive",
              data: MCTemp.ChartSeries[2],
              type: 'spline',
              yAxis: 1,
              color: "#FF0000"
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
  }

}