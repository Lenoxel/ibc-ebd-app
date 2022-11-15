import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_ENDPOINT } from 'config';
import { Observable } from 'rxjs';
import { IEbdClass, IEbdClassLessonDetails, IEbdLabel } from 'src/app/interfaces';
import { IPresenceRegister } from 'src/app/interfaces/presenceRegister';

@Injectable({
  providedIn: 'root'
})
export class LessonService {

  constructor(
    private httpClient: HttpClient,
  ) { }

  getEbdLabels(): Observable<IEbdLabel[]> {
    return this.httpClient.get<IEbdLabel[]>(`${API_ENDPOINT}/ebd/labels`);
  }

  getEbdLessons(): Observable<any> {
    return this.httpClient.get(`${API_ENDPOINT}/ebd/lessons`);
  }

  getEbdLesson(lessonId: number): Observable<any> {
    return this.httpClient.get(`${API_ENDPOINT}/ebd/lessons/${lessonId}`);
  }

  getEbdClassesByLesson(lessonId: number): Observable<IEbdClass[]> {
    return this.httpClient.get<IEbdClass[]>(`${API_ENDPOINT}/ebd/lessons/${lessonId}/classes`);
  }

  getEbdPresencesRegister(lessonId: number, classId: number): Observable<IPresenceRegister[]> {
    return this.httpClient.get<IPresenceRegister[]>(`${API_ENDPOINT}/ebd/lessons/${lessonId}/classes/${classId}/presences`);
  }

  getEbdClassLessonDetails(lessonId: number, classId: number): Observable<IEbdClassLessonDetails> {
    return this.httpClient.get<IEbdClassLessonDetails>(
      `${API_ENDPOINT}/ebd/lessons/${lessonId}/classes/${classId}/details`
    );
  }

  saveEbdClassLessonDetails(
    lessonId: number,
    classId: number,
    classLessonDetails: IEbdClassLessonDetails
  ): Observable<any> {
    return this.httpClient.put(
      `${API_ENDPOINT}/ebd/lessons/${lessonId}/classes/${classId}/details/`,
      classLessonDetails
    );
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
