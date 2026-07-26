/* eslint-disable @typescript-eslint/naming-convention */
import { HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { from } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root',
})
export class TokenInterceptorService {
  constructor(private injector: Injector) {}

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    return from(this.handle(request, next));
  }

  async handle(request: HttpRequest<any>, next: HttpHandler) {
    if (
      request.url?.includes('login') ||
      request.url?.includes('token/verify') ||
      request.url?.includes('token/refresh')
    ) {
      request = request.clone({
        setHeaders: {
          'Content-Type': 'application/json',
        },
      });

      return next.handle(request).toPromise();
    } else {
      const authService = this.injector.get(AuthService);

      if (authService.validAccessToken()) {
        const { access: token } = authService.token;

        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        return next.handle(request).toPromise();
      } else {
        const storageService = this.injector.get(StorageService);

        try {
          const token = await authService.refreshAccessToken().toPromise();

          storageService.set('jwt', token);

          request = request.clone({
            setHeaders: {
              Authorization: `Bearer ${token?.access}`,
              'Content-Type': 'application/json',
            },
          });

          return next.handle(request).toPromise();
        } catch (_) {
          await authService.logout();

          return next.handle(request).toPromise();
        }
      }
    }
  }
}
