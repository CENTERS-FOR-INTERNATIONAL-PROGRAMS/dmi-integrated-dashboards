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

    this.influenzaPositivityBySubtypeData();
  }

  //#region Load Chart --> Influenza positivity by type
  influenzaPositivityByTypeData() {
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

    this.influenzaPositivityByTypeChart();
  }

  influenzaPositivityByTypeChart() {
    this.influenzaPositivityByTypeOptions = {
      title: {
        text: 'Influenza Types',
        align: 'left'
      },
      chart: {
        type: "pie",
      },
      colors: [
        "#008000",
        "#FC7500",
        "#FF0000",
        "#234FEA"
      ],
      series: [
        {
          name: "Data",
          type: 'pie',
          data: [
            ["Negative", 9892],
            ["Flu A/B Pos", 0],
            ["Flu A Pos", 835],
            ["Flu B Pos", 364]
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

    this.influenzaPositivityBySubtypeChart();
  }

  influenzaPositivityBySubtypeChart() {
    this.influenzaPositivityBySubtypeOptions = {
      title: {
        text: 'Influenza Positivity by Subypes',
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
            ["Flu A non-subtypable", 384],
            ["H1N1", 508],
            ["H3N2", 0],
            ["Victoria", 0],
            ["Flu A Not yet Subtyped", 835],
            ["Flu B Not-determined", 835],
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
