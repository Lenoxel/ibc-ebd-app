import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_ENDPOINT } from 'config';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LessonService {

  constructor(
    private httpClient: HttpClient,
  ) { }

  getEbdLessons(): Observable<any> {
    return this.httpClient.get(`${API_ENDPOINT}/ebd/lessons`);
  }

  getEbdLesson(lessonId: number): Observable<any> {
    return this.httpClient.get(`${API_ENDPOINT}/ebd/lessons/${lessonId}`);
  }

  getEbdClassesByLesson(lessonId: number): Observable<any> {
    return this.httpClient.get(`${API_ENDPOINT}/ebd/lessons/${lessonId}/classes`);
  }

  getEbdPresencesRegister(lessonId: number, classId: number): Observable<any> {
    return this.httpClient.get(`${API_ENDPOINT}/ebd/lessons/${lessonId}/classes/${classId}/presences`);
  }
}
