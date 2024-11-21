import { inject, Injectable } from '@angular/core';
import { GenericClientService } from './generic';
import { environments } from 'src/environments/environment';
import { GithubStatusDetail } from '../interfaces/github';

@Injectable()
export class DashboardService {
  private readonly _genericClient = inject(GenericClientService);
  private readonly _baseUrl = environments.baseUrl;

  public login() {
    return window.open(this._baseUrl + '/github/login', '_self');
  }

  public status() {
    return this._genericClient.genericGet<GithubStatusDetail>(
      this._baseUrl + '/github/status'
    );
  }

  public remove() {
    return this._genericClient.genericDelete<{ message: string }>(
      this._baseUrl + '/github/remove'
    );
  }
}
