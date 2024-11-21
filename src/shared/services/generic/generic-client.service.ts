import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { THttpOptions } from 'src/shared/interfaces';
import { environments } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GenericClientService {
  private readonly _httpClient = inject(HttpClient);

  public genericGet<T>(endpoint: string, options: THttpOptions = {}) {
    return this._httpClient
      .get<T>(endpoint, options)
      .pipe(tap((response) => this.log(`Get ` + endpoint)));
  }

  public genericPost<T>(
    endpoint: string,
    body: any | null,
    options: THttpOptions = {}
  ) {
    return this._httpClient
      .post<T>(endpoint, body, options)
      .pipe(tap((response) => this.log(`Post ` + endpoint)));
  }

  public genericPut<T>(
    endpoint: string,
    body: any | null,
    options: THttpOptions = {}
  ) {
    return this._httpClient
      .put<T>(endpoint, body, options)
      .pipe(tap((response) => this.log(`Put ` + endpoint)));
  }

  public genericPatch<T>(
    endpoint: string,
    body: any | null,
    options: THttpOptions = {}
  ) {
    return this._httpClient
      .patch<T>(endpoint, body, options)
      .pipe(tap((response) => this.log(`Patch ` + endpoint)));
  }

  public genericDelete<T>(endpoint: string, options: THttpOptions = {}) {
    return this._httpClient
      .delete<T>(endpoint, options)
      .pipe(tap((response) => this.log(`Delete ` + endpoint)));
  }

  public log(message: string, showLogs: boolean = environments.showLogs) {
    if (showLogs) console.log(message);
  }

  public commonHeaders() {
    return {
      'Content-Type': 'application/json',
    };
  }
}
