import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';

import { environment } from './../../environments/environment';

export interface Course {
  id: number;
  title: string;
  description: string;
  address: string;
}

export interface Subject {
  id: string;
  name: string;
  description: string;
  courseId:string;
  subjectId:string;
  teacherId:string;
  courseDescription:string;
  teacherName:string,
  courseTitle:string;
}

export interface Student {
  id: number;
  firstName: string;
  lastName: string;
  birthDate: Date;
  registrationNo: string;
  courseSubjectId:number;
}

export interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
  birthDate:Date,
  salary: number;
}

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  apiUrl: string = environment.apiURL;
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient) { }


  // Read
  getSubject() {
    return this.http.get(this.apiUrl+ "/subject");
  }

  // Read
  getCourse() {
    return this.http.get(this.apiUrl + "/course");
  }

  // Read
  getStudent() {
    return this.http.get(this.apiUrl + "/student");
  }

  // Read
  getTeacher() {
    return this.http.get(this.apiUrl + "/teacher");
  }

  getSubjectByCourseId(id:number) {
    var API_URL = this.apiUrl+"/subject/course";
    API_URL = `${API_URL}/${id}`;
    return this.http.get(API_URL);
  }

  GetTeacherBySubjectId(id:number) {
    var API_URL = this.apiUrl+"/teacher";
    API_URL = `${API_URL}/${id}`;
    return this.http.get(API_URL);
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
