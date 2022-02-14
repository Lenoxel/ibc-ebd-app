import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { StorageService } from '../storage/storage.service';
import { map, switchMap, tap } from 'rxjs/operators';
import { EBD_API_ENDPOINT } from 'config';
import jwt_decode from 'jwt-decode';
import { IUser } from 'src/app/interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  $isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  token = '';
  $user:  BehaviorSubject<IUser> = new BehaviorSubject<IUser>(null);

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
      this.$isAuthenticated.next(true);
      this.loadUser(token);
    } else {
      this.$isAuthenticated.next(false);
    }
  }

  async loadUser({ access }: { access: string; refresh: string }) {
    const tempUser: any = jwt_decode(access);

    const user: IUser = {
      ...tempUser,
      isSuperuser: tempUser?.is_superuser,
      tokenType: tempUser?.token_type,
      userId: tempUser?.user_id,
    };

    user.fullAccess = !!(
      user.isSuperuser
      ||
      user.groups?.find(group => group?.name?.toLowerCase() === 'admin' || group?.name?.toLowerCase() === 'secretaria da igreja')
    );

    this.$user.next(user);
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.httpClient.post(`${EBD_API_ENDPOINT}/login/`, credentials).pipe(
      map((token: any) => token),
      switchMap(token => from(this.storageService.set('jwt', token))),
      tap(() => this.$isAuthenticated.next(true)),
    );
  }

  async logout() {
    this.$isAuthenticated.next(false);
    this.storageService.delete('jwt');
  }
}
