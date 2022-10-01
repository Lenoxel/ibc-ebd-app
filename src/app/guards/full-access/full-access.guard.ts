import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class FullAccessGuard implements CanLoad {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  canLoad(): Observable<boolean> {
    return this.authService.$user.pipe(
      filter(val => val !== null),
      take(1),
      map(user => {
        if (!user?.fullAccess) {
          this.router.navigateByUrl('tabs/lessons', { replaceUrl: true, });
        } else {
          return true;
        }
      })
    );
  }
}
