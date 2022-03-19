import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_ENDPOINT } from 'config';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IPresenceRegister } from 'src/app/interfaces/presenceRegister';

@Injectable({
  providedIn: 'root'
})
export class LessonService {

  constructor(
    private httpClient: HttpClient,
  ) { }

  getEbdLabels(): Observable<any> {
    return this.httpClient.get(`${API_ENDPOINT}/ebd/labels`);
  }

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

  saveUniqueEbdPresenceRegister(
    lessonId: number,
    classId: number,
    presenceRegisterId: number,
    presenceRegisterToUpdate: Partial<IPresenceRegister>,
  ): Observable<any> {
    return this.httpClient.put(
      `${API_ENDPOINT}/ebd/lessons/${lessonId}/classes/${classId}/presences/${presenceRegisterId}/`,
      presenceRegisterToUpdate
    );
  }
}
