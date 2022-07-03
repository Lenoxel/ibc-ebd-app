import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_ENDPOINT } from 'config';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IStudent } from 'src/app/interfaces/student';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  constructor(
    private httpClient: HttpClient,
  ) { }

  getEbdStudents(classId?: number): Observable<IStudent[]> {
    return this.httpClient.get<IStudent[]>(`${API_ENDPOINT}/ebd/students${classId ? `?classId=${classId}` : ''}`).pipe(
      map(ebdStudents => ebdStudents)
    );
  }

  getEbdStudentHistory(studentId: number): Observable<any> {
    return this.httpClient.get(`${API_ENDPOINT}/ebd/students/${studentId}/history`);
  }
}
