import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_ENDPOINT } from 'config';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  EBDClassMemberJoinRequest,
  EntityBasic,
  MemberSearchResult,
} from 'src/app/types';

@Injectable({
  providedIn: 'root',
})
export class EbdService {
  constructor(private httpClient: HttpClient) {}

  getEbdClasses(): Observable<EntityBasic[]> {
    return this.httpClient
      .get<EntityBasic[]>(`${API_ENDPOINT}/ebd/classes`)
      .pipe(map((classes: EntityBasic[]) => classes));
  }

  removeMemberFromClass(classId: number, memberId: number): Observable<any> {
    return this.httpClient.delete(
      `${API_ENDPOINT}/ebd/classes/${classId}/members/${memberId}`,
    );
  }

  toggleMemberRelation(
    classId: number,
    memberId: number,
    newRelation: string,
  ): Observable<any> {
    return this.httpClient.patch(
      `${API_ENDPOINT}/ebd/classes/${classId}/members/${memberId}/ebd-relation/`,
      { ebd_relation: newRelation },
    );
  }

  getEbdMembersRequestsToJoinClass(
    classId: number,
  ): Observable<EBDClassMemberJoinRequest[]> {
    return this.httpClient
      .get<
        EBDClassMemberJoinRequest[]
      >(`${API_ENDPOINT}/ebd/classes/${classId}/members/requests`)
      .pipe(map((requests: EBDClassMemberJoinRequest[]) => requests));
  }

  requestMemberToJoinClass(
    classId: number,
    memberId: number,
    memberType: string,
  ): Observable<any> {
    return this.httpClient.post(
      `${API_ENDPOINT}/ebd/classes/${classId}/members/request-to-join/`,
      {
        member_id: memberId,
        ebd_class_member_type: memberType,
      },
    );
  }

  searchMembers(query: string): Observable<MemberSearchResult[]> {
    return this.httpClient.get<MemberSearchResult[]>(
      `${API_ENDPOINT}/members?name=${query}`,
    );
  }

  getEbdPresencesByClass(classId: number): Observable<any> {
    return this.httpClient
      .get(`${API_ENDPOINT}/ebd/classes/${classId}/presences/`)
      .pipe(map((presences: any) => presences));
  }

  getEbdPresencesByUser(userId: string): Observable<any> {
    return this.httpClient
      .get(`${API_ENDPOINT}/ebd/users/${userId}/presences/`)
      .pipe(map((presences: any) => presences));
  }

  getEbdPresencesAnalytics(userId: string): Observable<any> {
    return this.httpClient
      .get(`${API_ENDPOINT}/ebd/presences/analytics/`)
      .pipe(map((presencesAnalytics: any) => presencesAnalytics));
  }
}
