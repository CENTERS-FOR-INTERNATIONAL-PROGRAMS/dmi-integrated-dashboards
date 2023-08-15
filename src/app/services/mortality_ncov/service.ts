import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, retry, throwError } from 'rxjs';

import { Covid19Summary } from '../../models/mortality_ncov/covid19Summary.model';
import { Covid19Properties } from '../../models/mortality_ncov/covid19Properties.model';

@Injectable({
    providedIn: 'root'
})

export class ReviewService {
    //#region Overview
    public BASE_URL_COVID19_SUMMARY = 'http://localhost:8080/api/overview/findCovid19Summary';
    public BASE_URL_COVID19_SUMMARYBYMONTH = 'http://localhost:8080/api/overview/findCovid19SummaryByMonth';
    public BASE_URL_CASCADE = 'http://localhost:8080/api/overview/findCovid19ScreeningEnrollmentCascade';
    public BASE_URL = 'http://localhost:8080/api/overview/findCovid19Positivity';
    public BASE_URL1 = 'http://localhost:8080/api/overview/findCovid19OverTime';
    public BASE_URL3 = 'http://localhost:8080/api/overview/findCovid19PositivityByAgeGender';
    public BASE_URL_BY_GENDER = 'http://localhost:8080/api/overview/findCovid19PositivityByGender';
    public BASE_URL_BY_FACILITY = 'http://localhost:8080/api/overview/findCovid19OverallPositivityByFacility';
    //#endregion

    //#region Enrolment
    public BASE_URLE1 = 'http://localhost:8080/api/covid19/enrolment/findByGender';
    public BASE_URLE2 = 'http://localhost:8080/api/covid19/enrolment/findByAgeGender';
    public BASE_URLE3 = 'http://localhost:8080/api/covid19/enrolment/findByFacility';
    public BASE_URLE4 = 'http://localhost:8080/api/covid19/enrolment/findOverTime';
    //#endregion

    //#region Screening
    public BASE_URLES1 = 'http://localhost:8080/api/covid19/screening/findCascade';
    public BASE_URLES2 = 'http://localhost:8080/api/screening/findScreeningByAgeGender';
    public BASE_URLES3 = 'http://localhost:8080/api/screening/findScreeningByHealthFacilities';
    public BASE_URLES4 = 'http://localhost:8080/api/screening/findScreeningOverTime';
    //#endregion

    //#region Results
    public BASE_URLR1 = 'http://localhost:8080/api/covid19/results/findByStatus';
    public BASE_URLR2 = 'http://localhost:8080/api/covid19/results/findByFacility';
    public BASE_URLR3 = 'http://localhost:8080/api/covid19/results/findByAgeGender';
    public BASE_URLR4 = 'http://localhost:8080/api/covid19/results/findByPositivityOverTime';
    //#endregion

    constructor(private http: HttpClient) { }

    //#region Overview

    findSummary(): Observable<Covid19Summary[]> {
        return this.http.get<Covid19Summary[]>(`${this.BASE_URL_COVID19_SUMMARY}`).pipe(
            retry(1),
            catchError(this.handleError)
        );
    }

    findSummaryByMonth(): Observable<Covid19Summary[]> {
        return this.http.get<Covid19Summary[]>(`${this.BASE_URL_COVID19_SUMMARYBYMONTH}`).pipe(
            retry(1),
            catchError(this.handleError)
        );
    }

    findCovid19Cascade(): Observable<Covid19Properties[]> {
        return this.http.get<Covid19Properties[]>(`${this.BASE_URL_CASCADE}`).pipe(
            retry(1),
            catchError(this.handleError)
        );
    }

    findNumberEnrolledByFacility(): Observable<Covid19Properties[]> {
        console.log('In the service');
        return this.http.get<Covid19Properties[]>(`${this.BASE_URL}`).pipe(
            retry(1),
            catchError(this.handleError)
        );
    }

    findCovid19Positivity(): Observable<Covid19Properties[]> {
        console.log('In the service');
        return this.http.get<Covid19Properties[]>(`${this.BASE_URL}`).pipe(
            retry(1),
            catchError(this.handleError)
        );
    }

    findCovidPositivityOvertime(): Observable<Covid19Properties[]> {
        console.log('In the service');
        return this.http.get<Covid19Properties[]>(`${this.BASE_URL1}`).pipe(
            retry(1),
            catchError(this.handleError)
        );
    }

    findCovid19PositivityByGender(): Observable<Covid19Properties[]> {
        return this.http.get<Covid19Properties[]>(`${this.BASE_URL_BY_GENDER}`).pipe(
            retry(1),
            catchError(this.handleError)
        );
    }

    findCovid19OverallPositivityByFacility(): Observable<Covid19Properties[]> {
        return this.http.get<Covid19Properties[]>(`${this.BASE_URL_BY_FACILITY}`).pipe(
            retry(1),
            catchError(this.handleError)
        );
    }

    findCovid19PositivityByAgeGender(): Observable<Covid19Properties[]> {
        console.log('In the service');
        return this.http.get<Covid19Properties[]>(`${this.BASE_URL3}`).pipe(
            retry(1),
            catchError(this.handleError)
        );
    }

    //#endregion

    //#region Enrollment

    findEnrollmentByGender(): Observable<Covid19Properties[]> {
        return this.http.get<Covid19Properties[]>(`${this.BASE_URLE1}`).pipe(
            retry(1),
            catchError(this.handleError)
        );
    }

    findEnrollmentByAgeGender(): Observable<Covid19Properties[]> {
        return this.http.get<Covid19Properties[]>(`${this.BASE_URLE2}`).pipe(
            retry(1),
            catchError(this.handleError)
        );
    }

    findEnrollmentByFacility(): Observable<Covid19Properties[]> {
        return this.http.get<Covid19Properties[]>(`${this.BASE_URLE3}`).pipe(
            retry(1),
            catchError(this.handleError)
        );
    }

    findEnrollmentOverTime(): Observable<Covid19Properties[]> {
        return this.http.get<Covid19Properties[]>(`${this.BASE_URLE4}`).pipe(
            retry(1),
            catchError(this.handleError)
        );
    }

    //#endregion

    //#region Screening
    findCovid19ScreeningCascade(): Observable<Covid19Properties[]> {
        return this.http.get<Covid19Properties[]>(`${this.BASE_URLES1}`).pipe(
            retry(1),
            catchError(this.handleError)
        );
    }

    findScreeningByAgeGender(): Observable<Covid19Properties[]> {
        return this.http.get<Covid19Properties[]>(`${this.BASE_URLES2}`).pipe(
            retry(1),
            catchError(this.handleError)
        );
    }

    findScreeningByFacility(): Observable<Covid19Properties[]> {
        return this.http.get<Covid19Properties[]>(`${this.BASE_URLES3}`).pipe(
            retry(1),
            catchError(this.handleError)
        );
    }

    findScreeningByOvertime(): Observable<Covid19Properties[]> {
        return this.http.get<Covid19Properties[]>(`${this.BASE_URLES4}`).pipe(
            retry(1),
            catchError(this.handleError)
        );
    }

    //#endregion

    //#region Results

    findCovid19ResultsByStatus(): Observable<Covid19Properties[]> {
        return this.http.get<Covid19Properties[]>(`${this.BASE_URLR1}`).pipe(
            retry(1),
            catchError(this.handleError)
        );
    }

    findCovid19ResultsByFacility(): Observable<Covid19Properties[]> {
        return this.http.get<Covid19Properties[]>(`${this.BASE_URLR2}`).pipe(
            retry(1),
            catchError(this.handleError)
        );
    }

    findCovid19ResultsByAgeGender(): Observable<Covid19Properties[]> {
        return this.http.get<Covid19Properties[]>(`${this.BASE_URLR3}`).pipe(
            retry(1),
            catchError(this.handleError)
        );
    }

    findCovid19ResultsByPositivityOverTime(): Observable<Covid19Properties[]> {
        return this.http.get<Covid19Properties[]>(`${this.BASE_URLR4}`).pipe(
            retry(1),
            catchError(this.handleError)
        );
    }
    //#endregion

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