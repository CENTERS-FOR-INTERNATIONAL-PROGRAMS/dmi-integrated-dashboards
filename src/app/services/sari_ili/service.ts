import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, retry, throwError } from 'rxjs';

import { SARIProperties } from '../../models/sari_ili/SARIProperties.model';

@Injectable({
    providedIn: 'root'
})

export class ReviewService {
    //#region Overview
    public BASE_URL_O1 = 'http://localhost:8080/api/sari_ili/overview/findTypesByDistribution';
    public BASE_URL_O2 = 'http://localhost:8080/api/sari_ili/overview/findInfluenzaASubtypesDistribution';
    public BASE_URL_O3 = 'http://localhost:8080/api/sari_ili/overview/findInfluenzaBLineageDistribution';
    public BASE_URL_O4 = 'http://localhost:8080/api/sari_ili/overview/findOverallSARSCOV2Positivity';
    public BASE_URL_O5 = 'http://localhost:8080/api/sari_ili/overview/findSARSCOV2PositivityOvertime';
    public BASE_URL_O6 = 'http://localhost:8080/api/sari_ili/overview/findInfluenzaStrainsOvertime';
    //#endregion

    constructor(private http: HttpClient) { }

    //#region Overview
    findInfluenzaTypesDistribution(): Observable<SARIProperties[]> {
        return this.http.get<SARIProperties[]>(`${this.BASE_URL_O1}`).pipe(
            retry(1),
            catchError(this.handleError)
        );
    }

    findInfluenzaASubtypeDistribution(): Observable<SARIProperties[]> {
        return this.http.get<SARIProperties[]>(`${this.BASE_URL_O2}`).pipe(
            retry(1),
            catchError(this.handleError)
        );
    }

    findInfluenzaBLineageDistribution(): Observable<SARIProperties[]> {
        return this.http.get<SARIProperties[]>(`${this.BASE_URL_O3}`).pipe(
            retry(1),
            catchError(this.handleError)
        );
    }

    findOverallSARSCOV2Positivity(): Observable<SARIProperties[]> {
        return this.http.get<SARIProperties[]>(`${this.BASE_URL_O4}`).pipe(
            retry(1),
            catchError(this.handleError)
        );
    }

    findSARSCOV2PositivityOvertime(): Observable<SARIProperties[]> {
        return this.http.get<SARIProperties[]>(`${this.BASE_URL_O5}`).pipe(
            retry(1),
            catchError(this.handleError)
        );
    }

    findInfluenzaStrainsOvertime(): Observable<SARIProperties[]> {
        return this.http.get<SARIProperties[]>(`${this.BASE_URL_O6}`).pipe(
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