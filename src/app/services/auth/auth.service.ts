import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController, AlertInput } from '@ionic/angular';
import { API_ENDPOINT } from 'config';
import jwt_decode from 'jwt-decode';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { IUser } from 'src/app/interfaces';
import { StorageService } from '../storage/storage.service';
import { UserService } from '../user/user.service';
import { UtilService } from '../util/util.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  $isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    null
  );
  token: { access: string; refresh: string } = null;
  $user: BehaviorSubject<IUser> = new BehaviorSubject<IUser>(null);

  constructor(
    private readonly storageService: StorageService,
    private readonly httpClient: HttpClient,
    private readonly utilService: UtilService,
    private readonly alertController: AlertController,
    private readonly userService: UserService
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
  validAccessToken(
    { access }: { access: string; refresh: string } = this.token
  ) {
    const { exp }: any = jwt_decode(access);
    return !!(new Date().getTime() < Number(`${exp}000`));
  }

  validRefreshToken(
    { refresh }: { access: string; refresh: string } = this.token
  ) {
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
      passwordChangedAt: tempUser?.password_changed_at || null,
    };

    user.fullAccess = !!(
      user.isSuperuser ||
      user.groups?.find((group) =>
        ['admin', 'secretaria da igreja', 'superintendência'].includes(
          group?.name?.toLowerCase()
        )
      )
    );

    this.$user.next(user);

    // await this.userShouldUpdateInfo(
    //   user.userId,
    //   user.email,
    //   user.passwordChangedAt
    // );
  }

  async userShouldUpdateInfo(
    userId,
    currentEmail = '',
    passwordChangedAt = null
  ) {
    const hasEmail = !!currentEmail;
    const oldPassword =
      !passwordChangedAt ||
      this.utilService.olderThan(passwordChangedAt, 120, 'days');
    const inputs: AlertInput[] = [];

    if (!hasEmail || oldPassword) {
      let header = '';
      let message = '';

      if (!hasEmail && oldPassword) {
        header = 'Atualize suas informações de acesso';
        message =
          'Já faz um tempo que você não atualiza suas informações de acesso.';
        inputs.push({
          name: 'email',
          type: 'email',
          placeholder: 'Digite o seu melhor email',
        });
        inputs.push({
          name: 'password',
          type: 'password',
          placeholder: 'Digite uma nova senha',
        });
        inputs.push({
          name: 'confirmPassword',
          type: 'password',
          placeholder: 'Confirme a senha',
        });
      } else if (!hasEmail) {
        header = 'Atualize seu email';
        message = 'Você ainda não possui um email cadastrado.';
        inputs.push({
          name: 'email',
          type: 'email',
          placeholder: 'Digite o seu melhor email',
        });
      } else {
        header = 'Atualize sua senha';
        message = 'Já faz um tempo que você não atualiza sua senha.';
        inputs.push({
          name: 'password',
          type: 'password',
          placeholder: 'Digite uma nova senha',
        });
        inputs.push({
          name: 'confirmPassword',
          type: 'password',
          placeholder: 'Confirme a senha',
        });
      }

      const alert = await this.alertController.create({
        header,
        message,
        inputs,
        buttons: [
          {
            text: 'Agora não',
            role: 'cancel',
          },
          {
            text: 'Salvar',
            role: 'save',
            handler: ({ email, password }) => {
              this.userService
                .saveUserDetails(userId, { email, password })
                .subscribe((response) => {
                  console.log('response:', response);
                });
            },
          },
        ],
      });

      await alert.present();
    }
  }

  login(credentials: { username: string; password: string }): Observable<any> {
    return this.httpClient.post(`${API_ENDPOINT}/ebd/login/`, credentials).pipe(
      map((token: any) => token),
      switchMap((token) => from(this.handleToken(token))),
      tap(() => this.$isAuthenticated.next(true))
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

  refreshAccessToken(
    token: { refresh: string } = this.token
  ): Observable<{ access: string; refresh: string }> {
    return this.httpClient.post(`${API_ENDPOINT}/token/refresh/`, token).pipe(
      map(({ access }: { access: string }) => ({
        access,
        refresh: token.refresh,
      }))
    );
  }
}
