import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';

import { environment } from './../../environments/environment';

export interface ItemData {
  gender: string;
  name: string;
  email: string;
}

export interface Subject {
  id: string;
  name: string;
  description: number;
}


@Injectable({
  providedIn: 'root',
})
export class SubjectService {
  apiUrl: string = environment.apiURL+"/subject";
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient) {}
  
  // Create
  create(data: any): Observable<any> {
    // return this.http.post(API_URL, data).pipe(catchError(this.error));
    return this.http.post(this.apiUrl, data).pipe(catchError(this.error));
  }
  // Read
  show() {
    return this.http.get(this.apiUrl);
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
