export class IDFacility {
    facility_id: number = -1;
    facility_code: string = '-1';
    facility_name: string = '';

    constructor(facility: IDFacility) {
        Object.assign(this, facility);
    }
}