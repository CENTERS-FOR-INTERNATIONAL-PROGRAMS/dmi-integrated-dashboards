import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, retry, throwError } from 'rxjs';
import { Covid19Summary } from '../../models/mortality_ncov/covid19Summary.model';

@Injectable({
    providedIn: 'root'
})

export class ReviewService {
    public BASE_URL_COVID19_SUMMARYBYMONTH = 'http://localhost:8080/api/mortality_ncov/overview/findSummaryByLastMonth';

    constructor(private http: HttpClient) { }

    findSummaryByMonth(DataFilter: {}): Observable<Covid19Summary[]> {
        return this.http.post<Covid19Summary[]>(`${this.BASE_URL_COVID19_SUMMARYBYMONTH}`, DataFilter).pipe(
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