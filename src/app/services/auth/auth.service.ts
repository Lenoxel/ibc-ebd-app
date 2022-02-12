import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { StorageService } from '../storage/storage.service';
import { map, switchMap, tap } from 'rxjs/operators';
import { EBD_API_ENDPOINT } from 'config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  token = '';

  constructor(
    private storageService: StorageService,
    private httpClient: HttpClient,
  ) {
    this.loadToken();
  }

  async loadToken() {
    const token = await this.storageService.get('jwt');
    if (token) {
      this.token = token;
      this.isAuthenticated.next(true);
    } else {
      this.isAuthenticated.next(false);
    }
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.httpClient.post(`${EBD_API_ENDPOINT}/login/`, credentials).pipe(
      map((token: any) => token),
      switchMap(token => from(this.storageService.set('jwt', token))),
      tap(() => this.isAuthenticated.next(true)),
    );
  }

  async logout() {
    this.isAuthenticated.next(false);
    this.storageService.delete('jwt');
  }
}
