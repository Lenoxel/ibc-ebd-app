import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_ENDPOINT } from 'config';
import {
  IAnalyticsPresenceClassInfos,
  IAnalyticsPresenceCounts,
  IAnalyticsPresenceHistory,
  IAnalyticsPresenceUsers,
  IAnalyticsUsersInteractivity,
  IAnalyticsUsersPunctuality,
} from 'src/app/interfaces';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  constructor(private httpClient: HttpClient) {}

  getAnalyticsPresenceCounts() {
    return this.httpClient.get<IAnalyticsPresenceCounts>(
      `${API_ENDPOINT}/ebd/analytics/presences/counts?startDate=2022-07-17`
    );
  }

  getAnalyticsPresenceHistory() {
    return this.httpClient.get<IAnalyticsPresenceHistory[]>(
      `${API_ENDPOINT}/ebd/analytics/presences/history`
    );
  }

  getAnalyticsPresenceUsers() {
    return this.httpClient.get<IAnalyticsPresenceUsers>(
      `${API_ENDPOINT}/ebd/analytics/presences/users?startDate=2022-07-17&exemplaryCount=15&worryingCount=15`
    );
  }

  getAnalyticsUsersPunctuality() {
    return this.httpClient.get<IAnalyticsUsersPunctuality>(
      `${API_ENDPOINT}/ebd/analytics/presences/users/punctuality?startDate=2022-07-17&punctualCount=15`
    );
  }

  getAnalyticsUsersInteractivity() {
    return this.httpClient.get<IAnalyticsUsersInteractivity>(
      `${API_ENDPOINT}/ebd/analytics/presences/users/interactivity?startDate=2022-07-17&interactiveCount=15`
    );
  }

  getAnalyticsPresenceClassInfos(
    startDate = '',
    endDate = '',
    day = '',
    month = '',
    year = ''
  ) {
    const params: HttpParams = new HttpParams().appendAll({
      startDate,
      endDate,
      day,
      month,
      year,
    });

    return this.httpClient.get<IAnalyticsPresenceClassInfos>(
      `${API_ENDPOINT}/ebd/analytics/presences/classes`,
      { params }
    );
  }
}
