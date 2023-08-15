export interface Covid19Summary {
  TotalScreened: number;
  TotalScreenedLastMonth: number;

  Eligible: number;
  PercentEligible: number;
  EligibleLastMonth: number;

  Enrolled: number;
  PercentEnrolled: number;
  EnrolledLastMonth: number;

  Tested: number;
  PercentTested: number;
  TestedLastMonth: number;

  Positive: number;
  PercentPositive: number;
  PositiveLastMonth: number;
}

