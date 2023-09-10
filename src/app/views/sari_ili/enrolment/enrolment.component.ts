import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Chart } from '../../../models/sari_ili/Chart.model';
import { ChartParent } from '../../../models/sari_ili/ChartParent.model';
import { IDFilter } from '../../../models/IDFilter.model';
import { APIReader } from '../../../models/APIReader.model';
import { IDFacility } from '../../../models/IDFacility.model';

import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsSolidGauge from 'highcharts/modules/solid-gauge';

HighchartsMore(Highcharts);
HighchartsSolidGauge(Highcharts);

@Component({
  templateUrl: 'enrolment.component.html',
  styleUrls: ['enrolment.component.scss']
})

export class EnrolmentComponent implements OnInit {
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
    //#region Load Chart --> Influenza positivity by type
    this.CompositeCharts['findInfluenzaPositivityByType'] = new Chart(this.http);
    this.CompositeCharts['findInfluenzaPositivityByType'].loadData(
      "enrolment/findInfluenzaPositivityByType",
      () => {
        let MCTemp = this.CompositeCharts['findInfluenzaPositivityByType'];

        for (let index = 0; index < 4; index++) {
          MCTemp.ChartSeries.push([]);
          MCTemp.ChartSeries[index].push(0);
          MCTemp.ChartSeries[index].push(0);
        }

        MCTemp.LoadChartOptions();
      },
      () => {
        let MCTemp = this.CompositeCharts['findInfluenzaPositivityByType'];

        //Influenza A Positive (Index --> 0)
        MCTemp.ChartSeries[0][0] = MCTemp.ChartData[0].InfluenzaAPositiveNumber;
        MCTemp.ChartSeries[0][1] = MCTemp.ChartData[0].InfluenzaAPositivePercentage;

        //Influenza B Positive (Index --> 1)
        MCTemp.ChartSeries[1][0] = MCTemp.ChartData[0].InfluenzaBPositiveNumber;
        MCTemp.ChartSeries[1][1] = MCTemp.ChartData[0].InfluenzaBPositivePercentage;

        //Influenza AB Positive (Index --> 2)
        MCTemp.ChartSeries[2][0] = MCTemp.ChartData[0].InfluenzaABPositiveNumber;
        MCTemp.ChartSeries[2][1] = MCTemp.ChartData[0].InfluenzaABPositivePercentage;

        //Negative (Index --> 3)
        MCTemp.ChartSeries[3][0] = MCTemp.ChartData[0].TestedNegativeFluNumber;
      },
      () => {
        let MCTemp = this.CompositeCharts['findInfluenzaPositivityByType'];

        MCTemp.ChartOptions = {
          title: {
            text: 'Influenza Positivity by Types',
            align: 'left'
          },
          chart: {
            type: "pie",
          },
          colors: [
            "#FF0000",
            "#234FEA",
            "#FFA500",
            "#008000"
          ],
          series: [
            {
              name: "Data",
              type: 'pie',
              data: [
                ["Flu A Pos (" + MCTemp.ChartSeries[0][1] + "%)", MCTemp.ChartSeries[0][0]],
                ["Flu B Pos (" + MCTemp.ChartSeries[1][1] + "%)", MCTemp.ChartSeries[1][0]],
                ["Flu A/B Pos (" + MCTemp.ChartSeries[2][1] + "%)", MCTemp.ChartSeries[2][0]],
                ["Negative", MCTemp.ChartSeries[3][0]]
              ]
            }
          ],
          plotOptions: {
            pie: {
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

    //#region Load Chart --> Influenza positivity by subtype
    this.CompositeCharts['findInfluenzaPositivityBySubtype'] = new Chart(this.http);
    this.CompositeCharts['findInfluenzaPositivityBySubtype'].loadData(
      "enrolment/findInfluenzaPositivityBySubtype",
      () => {
        let MCTemp = this.CompositeCharts['findInfluenzaPositivityBySubtype'];

        for (let index = 0; index < 6; index++) {
          MCTemp.ChartSeries.push([]);
          MCTemp.ChartSeries[index].push(0);
          MCTemp.ChartSeries[index].push(0);
        }

        MCTemp.LoadChartOptions();
      },
      () => {
        let MCTemp = this.CompositeCharts['findInfluenzaPositivityBySubtype'];

        //Flu A Non-subtypable (Index --> 0)
        MCTemp.ChartSeries[0][0] = MCTemp.ChartData[0].FluANonSubTypableNumber;
        MCTemp.ChartSeries[0][1] = MCTemp.ChartData[0].FluANonSubTypablePercentage;

        //H1N1 (Index --> 1)
        MCTemp.ChartSeries[1][0] = MCTemp.ChartData[0].H1N1Number;
        MCTemp.ChartSeries[1][1] = MCTemp.ChartData[0].H1N1Percentage;

        //H3N2 (Index --> 2)
        MCTemp.ChartSeries[2][0] = MCTemp.ChartData[0].H3N2Number;
        MCTemp.ChartSeries[2][1] = MCTemp.ChartData[0].H3N2Percentage;

        //Victoria (Index --> 3)
        MCTemp.ChartSeries[3][0] = MCTemp.ChartData[0].VictoriaNumber;
        MCTemp.ChartSeries[3][1] = MCTemp.ChartData[0].VictoriaPercentage;

        //Flu A Not Yet Subtyped (Index --> 4)
        MCTemp.ChartSeries[4][0] = MCTemp.ChartData[0].FluANotYetSubTypedNumber;
        MCTemp.ChartSeries[4][1] = MCTemp.ChartData[0].FluANotYetSubTypedPercentage;

        //Flu b Not Yet Determined (Index --> 5)
        MCTemp.ChartSeries[5][0] = MCTemp.ChartData[0].FlueBNotYetDeterminedNumber;
        MCTemp.ChartSeries[5][1] = MCTemp.ChartData[0].FlueBNotYetDeterminedPercentage;
      },
      () => {
        let MCTemp = this.CompositeCharts['findInfluenzaPositivityBySubtype'];

        MCTemp.ChartOptions = {
          title: {
            text: 'Influenza Positivity by Subtypes',
            align: 'left'
          },
          chart: {
            type: "pie",
          },
          colors: [
            "#234FEA",
            "#FF0000",
            "#008000",
            "#FFB3E6",
            "#CCB3FF",
            "#FFA500",
            "#B3FFB3",
          ],
          series: [
            {
              name: "Data",
              type: 'pie',
              data: [
                ["Flu A non-subtypable (" + MCTemp.ChartSeries[0][1] + "%)", MCTemp.ChartSeries[0][0]],
                ["H1N1 (" + MCTemp.ChartSeries[1][1] + "%)", MCTemp.ChartSeries[1][0]],
                ["H3N2 (" + MCTemp.ChartSeries[2][1] + "%)", MCTemp.ChartSeries[2][0]],
                ["Victoria (" + MCTemp.ChartSeries[3][1] + "%)", MCTemp.ChartSeries[3][0]],
                ["Flu A Not yet Subtyped (" + MCTemp.ChartSeries[4][1] + "%)", MCTemp.ChartSeries[4][0]],
                ["Flu B Not-determined (" + MCTemp.ChartSeries[5][1] + "%)", MCTemp.ChartSeries[5][0]],
              ]
            }
          ],
          plotOptions: {
            pie: {
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

    HC_exporting(Highcharts);
  }
}
