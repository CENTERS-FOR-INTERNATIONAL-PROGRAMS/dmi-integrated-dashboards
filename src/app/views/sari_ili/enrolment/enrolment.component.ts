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
  templateUrl: 'enrolment.component.html',
  styleUrls: ['enrolment.component.scss']
})

export class EnrolmentComponent implements OnInit {
  //#region Prerequisites
  highcharts = Highcharts;
  //#endregion

  //#region Prerequisites --> Influenza positivity by type
  influenzaPositivityByType: SARIProperties[] = [];
  influenzaPositivityByTypeSeries: any[] = [];
  influenzaPositivityByTypeOptions: {} = {};
  //#endregion

  //#region Prerequisites --> Influenza positivity by subtype
  influenzaPositivityBySubtype: SARIProperties[] = [];
  influenzaPositivityBySubtypeSeries: any[] = [];
  influenzaPositivityBySubtypeOptions: {} = {};
  //#endregion

  constructor(private reviewService: ReviewService) { }
  ngOnInit(): void {
    this.influenzaPositivityByTypeData();
    this.influenzaPositivityByTypeChart();

    this.influenzaPositivityBySubtypeData();
    this.influenzaPositivityBySubtypeChart();
  }

  //#region Load Chart --> Influenza positivity by type
  influenzaPositivityByTypeData() {
    for (let index = 0; index < 4; index++) {
      this.influenzaPositivityByTypeSeries.push([]);

      for (let j = 0; j < 2; j++) {
        this.influenzaPositivityByTypeSeries[index].push(0);
      }
    }

    this.reviewService.findInfluenzaPositivityByType().subscribe(
      response => {
        this.influenzaPositivityByType = response;

        //Influenza A Positive (Index --> 0)
        this.influenzaPositivityByTypeSeries[0][0] = this.influenzaPositivityByType[0].InfluenzaAPositiveNumber;
        this.influenzaPositivityByTypeSeries[0][1] = this.influenzaPositivityByType[0].InfluenzaAPositivePercentage;

        //Influenza B Positive (Index --> 1)
        this.influenzaPositivityByTypeSeries[1][0] = this.influenzaPositivityByType[0].InfluenzaBPositiveNumber;
        this.influenzaPositivityByTypeSeries[1][1] = this.influenzaPositivityByType[0].InfluenzaBPositivePercentage;

        //Influenza AB Positive (Index --> 2)
        this.influenzaPositivityByTypeSeries[2][0] = this.influenzaPositivityByType[0].InfluenzaABPositiveNumber;
        this.influenzaPositivityByTypeSeries[2][1] = this.influenzaPositivityByType[0].InfluenzaABPositivePercentage;

        //Negative (Index --> 3)
        this.influenzaPositivityByTypeSeries[3][0] = this.influenzaPositivityByType[0].TestedNegativeFluNumber;

        this.influenzaPositivityByTypeChart();
      });
  }

  influenzaPositivityByTypeChart() {
    this.influenzaPositivityByTypeOptions = {
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
        "#FC7500",
        "#008000"
      ],
      series: [
        {
          name: "Data",
          type: 'pie',
          data: [
            ["Flu A Pos (" + this.influenzaPositivityByTypeSeries[0][1] + "%)", this.influenzaPositivityByTypeSeries[0][0]],
            ["Flu B Pos (" + this.influenzaPositivityByTypeSeries[1][1] + "%)", this.influenzaPositivityByTypeSeries[1][0]],
            ["Flu A/B Pos (" + this.influenzaPositivityByTypeSeries[2][1] + "%)", this.influenzaPositivityByTypeSeries[2][0]],
            ["Negative", this.influenzaPositivityByTypeSeries[3][0]]
          ]
        }
      ],
      plotOptions: {
        pie: {
          dataLabels: {
            enabled: true
          },
        },
      }
    };
  }
  //#endregion

  //#region Load Chart --> Influenza positivity by subtype
  influenzaPositivityBySubtypeData() {
    for (let index = 0; index < 6; index++) {
      this.influenzaPositivityBySubtypeSeries.push([]);

      for (let j = 0; j < 2; j++) {
        this.influenzaPositivityBySubtypeSeries[index].push(0);
      }
    }

    this.reviewService.findInfluenzaPositivityBySubtype().subscribe(
      response => {
        this.influenzaPositivityBySubtype = response;

        //Flu A Non-subtypable (Index --> 0)
        this.influenzaPositivityBySubtypeSeries[0][0] = this.influenzaPositivityBySubtype[0].FluANonSubTypableNumber;
        this.influenzaPositivityBySubtypeSeries[0][1] = this.influenzaPositivityBySubtype[0].FluANonSubTypablePercentage;

        //H1N1 (Index --> 1)
        this.influenzaPositivityBySubtypeSeries[1][0] = this.influenzaPositivityBySubtype[0].H1N1Number;
        this.influenzaPositivityBySubtypeSeries[1][1] = this.influenzaPositivityBySubtype[0].H1N1Percentage;

        //H3N2 (Index --> 2)
        this.influenzaPositivityBySubtypeSeries[2][0] = this.influenzaPositivityBySubtype[0].H3N2Number;
        this.influenzaPositivityBySubtypeSeries[2][1] = this.influenzaPositivityBySubtype[0].H3N2Percentage;

        //Victoria (Index --> 3)
        this.influenzaPositivityBySubtypeSeries[3][0] = this.influenzaPositivityBySubtype[0].VictoriaNumber;
        this.influenzaPositivityBySubtypeSeries[3][1] = this.influenzaPositivityBySubtype[0].VictoriaPercentage;

        //Flu A Not Yet Subtyped (Index --> 4)
        this.influenzaPositivityBySubtypeSeries[4][0] = this.influenzaPositivityBySubtype[0].FluANotYetSubTypedNumber;
        this.influenzaPositivityBySubtypeSeries[4][1] = this.influenzaPositivityBySubtype[0].FluANotYetSubTypedPercentage;

        //Flu b Not Yet Determined (Index --> 5)
        this.influenzaPositivityBySubtypeSeries[5][0] = this.influenzaPositivityBySubtype[0].FlueBNotYetDeterminedNumber;
        this.influenzaPositivityBySubtypeSeries[5][1] = this.influenzaPositivityBySubtype[0].FlueBNotYetDeterminedPercentage;

        this.influenzaPositivityBySubtypeChart();
      });
  }

  influenzaPositivityBySubtypeChart() {
    this.influenzaPositivityBySubtypeOptions = {
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
        "#FC7500",
        "#B3FFB3",
      ],
      series: [
        {
          name: "Data",
          type: 'pie',
          data: [
            ["Flu A non-subtypable (" + this.influenzaPositivityBySubtypeSeries[0][1] + "%)", this.influenzaPositivityBySubtypeSeries[0][0]],
            ["H1N1 (" + this.influenzaPositivityBySubtypeSeries[1][1] + "%)", this.influenzaPositivityBySubtypeSeries[1][0]],
            ["H3N2 (" + this.influenzaPositivityBySubtypeSeries[2][1] + "%)", this.influenzaPositivityBySubtypeSeries[2][0]],
            ["Victoria (" + this.influenzaPositivityBySubtypeSeries[3][1] + "%)", this.influenzaPositivityBySubtypeSeries[3][0]],
            ["Flu A Not yet Subtyped (" + this.influenzaPositivityBySubtypeSeries[4][1] + "%)", this.influenzaPositivityBySubtypeSeries[4][0]],
            ["Flu B Not-determined (" + this.influenzaPositivityBySubtypeSeries[5][1] + "%)", this.influenzaPositivityBySubtypeSeries[5][0]],
          ]
        }
      ],
      plotOptions: {
        pie: {
          dataLabels: {
            enabled: true
          },
        },
      }
    };
  }
  //#endregion

}
