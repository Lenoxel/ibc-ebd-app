import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_ENDPOINT } from 'config';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IEbdClass } from 'src/app/interfaces';
import { EntityBasic } from 'src/app/types';

@Injectable({
  providedIn: 'root'
})
export class EbdService {

  constructor(
    private httpClient: HttpClient,
  ) { }

  getEbdClasses(): Observable<EntityBasic[]> {
    return this.httpClient.get(`${API_ENDPOINT}/ebd/classes`).pipe(
      map((classes: EntityBasic[]) => classes),
    );
  }

  getEbdPresencesByClass(classId: number): Observable<any> {
    return this.httpClient.get(`${API_ENDPOINT}/ebd/classes/${classId}/presences/`).pipe(
      map((presences: any) => presences),
    );
  }

  getEbdPresencesByUser(userId: string): Observable<any> {
    return this.httpClient.get(`${API_ENDPOINT}/ebd/users/${userId}/presences/`).pipe(
      map((presences: any) => presences),
    );
  }

  getEbdPresencesAnalytics(userId: string): Observable<any> {
    return this.httpClient.get(`${API_ENDPOINT}/ebd/presences/analytics/`).pipe(
      map((presencesAnalytics: any) => presencesAnalytics),
    );
  }
}
