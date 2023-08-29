import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, retry, throwError } from 'rxjs';
// import { DMIFacility } from './DMIFacility.model';

@Injectable({
    providedIn: 'root'
})

export class APIReader {
    api_endpoint: string = "http://localhost:8080/api";
    postProcessData: any;
    CompositeData: any;

    constructor(private http: HttpClient) { }

    loadData(endpoint: string, postProcessData: any): void {
        this.api_endpoint = this.api_endpoint + "/" + endpoint;
        this.postProcessData = postProcessData;

        this.readAPI().subscribe(
            response => {
                this.CompositeData = response;
                this.postProcessData();
            });
    }

    readAPI(): Observable<any[]> {
        return this.http.post<any[]>(`${this.api_endpoint}`, {}).pipe(
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