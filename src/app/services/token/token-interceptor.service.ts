/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable, Injector} from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService {

  constructor(
    private injector: Injector
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.url?.includes('login') || request.url?.includes('token/verify') || request.url?.includes('token/refresh')) {
      request = request.clone({
        setHeaders: {
          'Content-Type': 'application/json',
        }
      });

      return next.handle(request);
    } else {
      const authService = this.injector.get(AuthService);

      if (authService.validAccessToken()) {
        const { access: token } = authService.token;

        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });

        return next.handle(request);
      } else {
        const storageService = this.injector.get(StorageService);

        authService.refreshAccessToken().subscribe({
          next: (token) => {
            storageService.set('jwt', token);

            request = request.clone({
              setHeaders: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              }
            });

            next.handle(request);
          }
        });
      }
    }
  }
}
