export class IDFacility {
    facility_id: number = -1;
    facility_code: string = '-1';
    facility_name: string = '';

    constructor(facility_id: number, facility_code: string, facility_name: string) {
        this.facility_id = facility_id;
        this.facility_code = facility_code;
        this.facility_name = facility_name;
    }
}