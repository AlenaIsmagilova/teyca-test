import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { tap } from 'rxjs';
import { IAuthResponse } from '../models/profile.models';
import { CookieService } from 'ngx-cookie-service';

export interface ILoginPayload {
  login: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private httpService = inject(HttpClient);
  private cookieService = inject(CookieService);

  private readonly baseApiUrl = 'https://api.teyca.ru/test-auth-only';
  private readonly _token = signal<string | null>(
    this.cookieService.get('access_token')
  );
  readonly token = computed(() => this._token());
  readonly isAuthenticated = computed(() => !!this._token());

  public login(payload: ILoginPayload) {
    return this.httpService
      .post<IAuthResponse>(`${this.baseApiUrl}`, payload)
      .pipe(
        tap((val) => {
          this._token.set(val.auth_token);
          this.cookieService.set('access_token', val.auth_token);
        })
      );
  }

  public logout() {
    this._token.set(null);
    this.cookieService.delete('access_token');
  }
}
