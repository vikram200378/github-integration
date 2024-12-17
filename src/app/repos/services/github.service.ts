import { HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environments } from 'src/environments/environment';
import { GithubData } from 'src/shared/interfaces';
import { GenericClientService } from 'src/shared/services/generic';

export enum GithubDataType {
  repos = 'repos',
  commits = 'commits',
  pullRequests = 'pullRequests',
  issues = 'issues',
}

@Injectable({
  providedIn: 'root',
})
export class GithubService {
  private readonly _genericClient = inject(GenericClientService);

  /**
   * Get Repos
   * @param page
   * @param limit
   * @returns
   */
  public getRepos<T>(
    type: GithubDataType,
    page: number,
    limit: number
  ): Observable<GithubData<T>> {
    const endpoint = `${environments.baseUrl}/api/github/${type}`;

    const httpParams = new HttpParams()
      ?.set('page', page || 1)
      ?.set('limit', limit || 10);

    return this._genericClient.genericGet<GithubData<T>>(endpoint, {
      params: httpParams,
    });
  }
}
