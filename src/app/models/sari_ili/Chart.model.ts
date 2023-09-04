import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, retry, throwError } from 'rxjs';
import { SARIProperties } from './SARIProperties.model';

@Injectable({
    providedIn: 'root'
})

export class Chart {
    chart_api_endpoint: string = "http://localhost:8080/api/sari_ili";
    ChartAPIService: any;
    ChartData: SARIProperties[] = [];
    ChartFilterData: any = {};
    ChartSeries: any[] = [];
    ChartOptions: {} = {};
    PreProcessData: any;
    PostProcessData: any;
    LoadChartOptions: any;

    constructor(private http: HttpClient) { }

    loadData(endpoint: string, preProcessData: any, postProcessData: any, loadOptions: any): void {
        this.chart_api_endpoint += "/" + endpoint;
        this.PreProcessData = preProcessData;
        this.PostProcessData = postProcessData;
        this.LoadChartOptions = loadOptions;

        this.PreProcessData();

        this.readAPI().subscribe(
            response => {
                this.ChartData = response;
                this.PostProcessData();
                this.LoadChartOptions();
            });
    }

    reloadData() {
        this.readAPI().subscribe(
            response => {
                this.ChartData = response;
                this.PostProcessData();
                this.LoadChartOptions();
            });
    }

    readAPI(): Observable<SARIProperties[]> {
        const requestOptions = {
            headers: new HttpHeaders(
                {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Access-Control-Allow-Headers': 'Content-Type',
                }
            )
        };

        return this.http.post<SARIProperties[]>(`${this.chart_api_endpoint}`, this.ChartFilterData, requestOptions).pipe(
            retry(1),
            catchError(this.handleError)
        );
    }

    private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error.message);
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.error(
                `Backend returned code ${error.status}, ` + `body was: ${error.error}`
            );
        }
        // return an observable with a user-facing error message
        return throwError('Something bad happened. Please try again later.');
    }
}