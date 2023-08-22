export class DataFilter {
  filter_facility: string = '-1';

  filter_date_range_start: string = '-1';
  _filter_date_range_start: string = '-1';

  filter_date_range_end: string = '-1';
  _filter_date_range_end: string = '-1';

  filter_year: string = '-1';
  filter_epi_week_start: string = '-1';
  filter_epi_week_end: string = '-1';

  processDates() {
    this._filter_date_range_start = this.convertDate(this.filter_date_range_start);
    this._filter_date_range_end = this.convertDate(this.filter_date_range_end);
  }

  private convertDate(date_string: string) {
    if (date_string != '-1') {
      let dateInstance = new Date(date_string),
        month = ("0" + (dateInstance.getMonth() + 1)).slice(-2),
        day = ("0" + dateInstance.getDate()).slice(-2);
      return [day, month, dateInstance.getFullYear()].join("/");
    } else {
      return '-1'
    }
  }
}