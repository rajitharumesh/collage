import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';

import { environment } from './../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class CourseService {
  apiUrl: string = environment.apiURL+"/course";
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  constructor(private http: HttpClient) {}
  
  // Create
  create(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data).pipe(catchError(this.error));
  }
  
  // Update
  update(data: any): Observable<any> {
    return this.http.put(this.apiUrl, data).pipe(catchError(this.error));
  }

  // Delete
  delete(id: any): Observable<any> {
    var API_URL = `${this.apiUrl}/${id}`;
    return this.http.delete(API_URL).pipe(catchError(this.error));
  }

  // Handle Errors
  error(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(() => {
      return errorMessage;
    });
  }
}
