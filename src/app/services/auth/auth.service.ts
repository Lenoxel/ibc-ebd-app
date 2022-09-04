import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { StorageService } from '../storage/storage.service';
import { map, switchMap, tap } from 'rxjs/operators';
import { API_ENDPOINT } from 'config';
import jwt_decode from 'jwt-decode';
import { IUser } from 'src/app/interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  $isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  token: { access: string; refresh: string } = null;
  $user:  BehaviorSubject<IUser> = new BehaviorSubject<IUser>(null);

  constructor(
    private storageService: StorageService,
    private httpClient: HttpClient,
  ) {
    this.loadToken();
  }

  async loadToken() {
    const token = await this.storageService.get('jwt');
    if (token && this.validRefreshToken(token)) {
      this.token = token;
      this.$isAuthenticated.next(true);
      this.loadUser(token);
    } else {
      this.$isAuthenticated.next(false);
    }
  }

  // validAccessToken({ access }: { access: string; refresh: string } = this.token) {
  validAccessToken({ access }: { access: string; refresh: string } = this.token) {
    const { exp }: any = jwt_decode(access);
    return !!(new Date().getTime() < Number(`${exp}000`));
  }

  validRefreshToken({ refresh }: { access: string; refresh: string }  = this.token) {
    const { exp }: any = jwt_decode(refresh);
    return !!(new Date().getTime() < Number(`${exp}000`));
  }

  async loadUser({ access }: { access: string; refresh: string } = this.token) {
    const tempUser: any = jwt_decode(access);

    const user: IUser = {
      ...tempUser,
      classesAsATeacher: tempUser?.classes_as_a_teacher,
      classesAsASecretary: tempUser?.classes_as_a_secretary,
      isSuperuser: tempUser?.is_superuser,
      tokenType: tempUser?.token_type,
      userId: tempUser?.user_id,
    };

    user.fullAccess = !!(
      user.isSuperuser
      ||
      user.groups?.find(group =>
        group?.name?.toLowerCase() === 'admin'
        || group?.name?.toLowerCase() === 'secretaria da igreja'
        || group?.name?.toLowerCase() === 'superintendência'
      )
    );

    this.$user.next(user);
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.httpClient.post(`${API_ENDPOINT}/ebd/login/`, credentials).pipe(
      map((token: any) => token),
      switchMap(token => from(this.handleToken(token))),
      tap(() => this.$isAuthenticated.next(true)),
    );
  }

  async handleToken(token) {
    this.token = token;
    await this.storageService.set('jwt', token);
    return await this.loadToken();
  }

  async logout() {
    this.$isAuthenticated.next(false);
    this.storageService.delete('jwt');
  }

  refreshAccessToken(token: { refresh: string } = this.token): Observable<{ access: string; refresh: string }> {
    return this.httpClient.post(`${API_ENDPOINT}/token/refresh/`, token).pipe(
      map(({ access }: { access: string }) => ({ access, refresh: token.refresh })),
    );
  }
}
