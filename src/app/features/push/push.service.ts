import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ISendPushRequest, ISendPushResponse } from '../../models/push.models';
import { CookieService } from 'ngx-cookie-service';

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
