import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_ENDPOINT } from 'config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  constructor(
    private httpClient: HttpClient,
  ) { }

  getEbdStudents(classId?: number): Observable<any> {
    return this.httpClient.get(`${API_ENDPOINT}/ebd/students${classId ? `?classId=${classId}` : ''}`);
  }

  getEbdStudentHistory(studentId: number): Observable<any> {
    return this.httpClient.get(`${API_ENDPOINT}/ebd/students/${studentId}/history`);
  }
}
