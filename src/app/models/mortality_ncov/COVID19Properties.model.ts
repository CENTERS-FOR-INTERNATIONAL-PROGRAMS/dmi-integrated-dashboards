export interface COVID19Properties {
  ScreenedNumber(ScreenedNumber: any): unknown;
  EligibleNumber(EligibleNumber: any): unknown;
  TestedNumber(TestedNumber: any): unknown;
  PercentEligible: any;
  EpiWeek: number;
  SampleTested: Number;
  CovidPositive: number;

  Covid19Positive: number;
  Covid19Negative: number;

  PositiveNumber: number;
  Gender: string;
  AgeGroup: string;

  EnrolledNumber: number;
  Facility: string;

  TotalScreened: number;
  Eligible: number;
  
  Enrolled: number;
  PercentEnrolled: number;
  
  Tested: number;
  PercentTested: number;

  Positive: number;
  PercentPositive: number;

  female: number;
  male: number;

  EnrolledMale: number;
  EnrolledFemale: number;
  
  TestedMale: number;
  TestedFemale: number;
  
  PositiveMale: number;
  PositiveFemale: number;

  ElligibleNumber: number;
  Month: number;
  Year: string;

  Screened: number;

}

