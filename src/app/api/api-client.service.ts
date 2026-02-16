import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { IClientsResponse } from '../types/types';

@Injectable({
  providedIn: 'root',
})
export class ApiClientService {
  private readonly http = inject(HttpClient);
  private readonly cookieService = inject(CookieService);

  private readonly baseUrl = 'https://api.teyca.ru/v1';

  public getClients(params: {
    offset: number;
    limit: number;
    search?: string;
  }) {
    const token = this.cookieService.get('access_token');

    let httpParams = new HttpParams()
      .set('offset', String(params.offset))
      .set('limit', String(params.limit));

    if (params.search) {
      httpParams = httpParams.set('search', params.search.trim());
    }

    return this.http.get<IClientsResponse>(`${this.baseUrl}/${token}/passes`, {
      params: httpParams,
    });
  }
}
