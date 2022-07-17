import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_ENDPOINT } from 'config';
import { IAnalyticsPresenceClassInfos, IAnalyticsPresenceCounts, IAnalyticsPresenceHistory } from 'src/app/interfaces';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  constructor(
    private httpClient: HttpClient,
  ) { }

  getAnalyticsPresenceCounts() {
    return this.httpClient.get<IAnalyticsPresenceCounts>(`${API_ENDPOINT}/ebd/analytics/presences/counts`);
  }

  getAnalyticsPresenceHistory() {
    return this.httpClient.get<IAnalyticsPresenceHistory[]>(`${API_ENDPOINT}/ebd/analytics/presences/history`);
  }

  getAnalyticsPresenceClassInfos(day: string, month: string) {
    const params: HttpParams = new HttpParams().appendAll({
      day,
      month
    });

    return this.httpClient.get<IAnalyticsPresenceClassInfos>(`${API_ENDPOINT}/ebd/analytics/presences/classes`, { params });
  }
}
