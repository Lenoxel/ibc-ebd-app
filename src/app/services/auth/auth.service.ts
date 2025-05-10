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

    await this.userShouldUpdateInfo(
      user.userId,
      user.email,
      user.passwordChangedAt
    );
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

      let eyePasswordIconTop = '52.5%';

      if (!hasEmail && oldPassword) {
        header = 'Atualização de informações de acesso';
        message =
          'Já faz um tempo que você não atualiza suas informações de acesso.';

        eyePasswordIconTop = '62.5%';

        inputs.push({
          name: 'email',
          type: 'email',
          placeholder: 'Digite o seu melhor email',
          attributes: {
            required: true,
          },
        });
        inputs.push({
          name: 'password',
          type: 'password',
          placeholder: 'Digite uma nova senha',
          min: 8,
          attributes: {
            required: true,
            autocomplete: 'off',
          },
        });
        inputs.push({
          name: 'confirmPassword',
          type: 'password',
          placeholder: 'Confirme a senha',
          min: 8,
          attributes: {
            required: true,
            autocomplete: 'off',
          },
        });
      } else if (!hasEmail) {
        header = 'Atualização de email';
        message = 'Você ainda não possui um email cadastrado.';
        inputs.push({
          name: 'email',
          type: 'email',
          placeholder: 'Digite o seu melhor email',
          attributes: {
            required: true,
          },
        });
      } else {
        header = 'Atualização de senha';
        message = 'Já faz um tempo que você não atualiza sua senha.';
        inputs.push({
          name: 'password',
          type: 'password',
          placeholder: 'Digite uma nova senha',
          min: 8,
          attributes: {
            required: true,
            autocomplete: 'off',
          },
        });
        inputs.push({
          name: 'confirmPassword',
          type: 'password',
          placeholder: 'Confirme a senha',
          min: 8,
          attributes: {
            required: true,
            autocomplete: 'off',
          },
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
            handler: async ({ email, password }) => {
              if (!email && !password) {
                this.utilService.showToastController(
                  'Por favor, preencha os campos obrigatórios.',
                  'danger',
                  'top'
                );
                return false;
              }

              const buttons = document.querySelectorAll('ion-alert button');
              buttons.forEach((button) => {
                button.setAttribute('disabled', 'true');
              });

              const inputs = document.querySelectorAll('ion-alert input');
              inputs.forEach((input) => {
                input.setAttribute('disabled', 'true');
              });

              try {
                await this.userService
                  .saveUserDetails(userId, { email, password })
                  .toPromise();

                this.$user.next({
                  ...this.$user.getValue(),
                  email,
                  passwordChangedAt: new Date().toISOString(),
                });
                this.utilService.showToastController(
                  'Informações atualizadas com sucesso',
                  'success',
                  'top'
                );
              } catch (error) {
                console.log('error', error);
                this.utilService.showToastController(
                  'Houve um erro ao atualizar suas informações. Tente novamente mais tarde.',
                  'danger',
                  'top'
                );
              }
            },
          },
        ],
      });

      await alert.present();

      let isPasswordVisible = false;

      const inputElement = document.querySelector<HTMLIonInputElement>(
        'ion-alert input[type="password"]'
      );

      const eyeIcon = document.createElement('ion-icon');
      eyeIcon.setAttribute('name', 'eye-off');
      eyeIcon.style.position = 'absolute';
      eyeIcon.style.right = '1.5rem';
      eyeIcon.style.top = eyePasswordIconTop;
      eyeIcon.style.transform = 'translateY(-50%)';
      eyeIcon.style.fontSize = '1.2rem';
      eyeIcon.style.cursor = 'pointer';

      eyeIcon.addEventListener('click', () => {
        isPasswordVisible = !isPasswordVisible;
        inputElement.type = isPasswordVisible ? 'text' : 'password';
        eyeIcon.setAttribute('name', isPasswordVisible ? 'eye' : 'eye-off');
      });

      setTimeout(() => {
        inputElement?.parentElement?.appendChild(eyeIcon);
      }, 50);
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
