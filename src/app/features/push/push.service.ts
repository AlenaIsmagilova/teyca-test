import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { ISendPushRequest, ISendPushResponse } from '../../types/types';

@Injectable({
  providedIn: 'root',
})
export class PushModalService {
  private readonly http = inject(HttpClient);
  private readonly cookieService = inject(CookieService);

  private readonly baseUrl = 'https://api.teyca.ru/v1';

  public sendPush(payload: ISendPushRequest) {
    const token = this.cookieService.get('access_token');

    return this.http.post<ISendPushResponse>(
      `${this.baseUrl}/${token}/message/push`,
      payload
    );
  }
}
