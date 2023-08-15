export interface SARIProperties {
    Covid19TestedNumber: number;
    Covid19PositiveNumber: number;
    Covid19PositivePercent: number;
    EPIWeek: number;
    Month: number;
    Year: number;

    Scenario: string;
    Subtype: string;
    Count: number;
    Percentage: number;

    InfluenzaAPositive: number;
    InfluenzaBPositive: number;
    TotalTestsDone: number;
    InfluenzaAPositivePercent: number;
    InfluenzaBPositivePercent: number;
    NegativeFluPercent: number;
    NegativeFluNumber: number;

    // ------------------------------
    AH1N1Number: number;
    AH1N1NumberPercent: number;

    AH3N2Number: number;
    AH3N2NumberPercent: number;

    NonSubTypableNumber: number;
    NonSubTypableNumberPercent: number;

    NotSubTypeNumber: number;
    NotSubTypeNumberPercent: number;

    TotalInfluenzaSubTypeA: number;

    // ------------------------------

    YamagataNumber: number;
    VictoriaNumber: number;
    NotdeterminedNumber: number;
    TotalInfluenzaBLineage: number;
    YamagataNumberPercent: number;
    VictoriaNumberPercent: number;
    NotdeterminedNumberPercent: number;

    // ------------------------------

    CovidNegativeNumber: number;
    CovidPositiveNumber: number;
    CovidTestedNumber: number;
    CovidNegativeNumberPercent: number;
    CovidPositiveNumberPercent: number;

    // ------------------------------
    
    Covid19Tested: number;
    Covid19Positive: number;

    // ------------------------------
    
    InfluenzaNeg: number;
    EpiWeek: number;
    
    // ------------------------------
}