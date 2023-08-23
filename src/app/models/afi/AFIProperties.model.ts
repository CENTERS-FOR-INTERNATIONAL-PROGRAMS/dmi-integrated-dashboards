export interface AFIProperties {
    PlasmodiumNumber(PlasmodiumNumber: any): unknown;
    HIV1Number(HIV1Number: any): unknown;
    SalmonellaNumber(SalmonellaNumber: any): unknown;
    RickettsiaNumber(RickettsiaNumber: any): unknown;
    DengueNumber(DengueNumber: any): unknown;
    BrucellaNumber(BrucellaNumber: any): unknown;
    SPneumoniaeNumber(SPneumoniaeNumber: any): unknown;
    ChikungunyaNumber(ChikungunyaNumber: any): unknown;
    LeishmaniaNumber(LeishmaniaNumber: any): unknown;
    BartonellaNumber(BartonellaNumber: any): unknown;
    LeptospiraNumber(LeptospiraNumber: any): unknown;
    CburnetiiNumber(CburnetiiNumber: any): unknown;
    RiftValleyFeverNumber(RiftValleyFeverNumber: any): unknown;
    BPseudomalleiNumber(BPseudomalleiNumber: any): unknown;
    
    WeekNumber: number;
    Count: number;
    Percentage: number;
    AgeGroup: string;
    Gender: string;
    ScreenedNumber: number;
    EnrolledNumber: number;
    EligibleNumber: number;
    SampledNumber: number;
    EligiblePercentage: number;
    EnrolledPercentage: number;
    SampledPercentage: number;

    TotalEnrolledNumber: number;
    MaleEnrolledNumber: number;
    FemaleEnrolledNumber: number;
    MaleEnrolledPercentage: number;
    FemaleEnrolledPercentage: number;

    TotalNumber: number;

    NegativeNumber: number;
    NegativePercentage: number;

    PositiveNumber: number;
    PositivePercentage: number;
    
    MERSCovNumber: number;
    SARINumber: number;
    UFNumber: number;
    DFNumber: number;
    NonUFSARIDFMERSCVONumber: number;
}