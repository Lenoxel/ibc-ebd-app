import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_ENDPOINT } from 'config';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

type UpdateUserDetailsDto = {
  email?: string;
  password?: string;
};

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private readonly httpClient: HttpClient) {}

  saveUserDetails(
    userId: number,
    { email = null, password = null }: UpdateUserDetailsDto
  ): Observable<unknown> {
    return this.httpClient
      .patch(`${API_ENDPOINT}/ebd/user/${userId}/`, {
        ...(email && { email }),
        ...(password && { password }),
      })
      .pipe(map((response) => response));
  }
}
