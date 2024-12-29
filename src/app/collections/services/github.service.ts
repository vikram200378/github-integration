import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { delay, map, Observable, of } from 'rxjs';
import { GenericClientService } from 'src/shared/services/generic';
import { getEntities, getSearchResult } from '../mock'; // Mock data if needed
import {
  EntitiesResponse,
  Entity,
} from 'src/shared/interfaces/github/entities.interface';
import { environments } from 'src/environments/environment';

export interface FilterParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: any;
}

@Injectable({
  providedIn: 'root',
})
export class GithubService {
  private readonly _genericClient = inject(GenericClientService);
  private readonly httpClient = inject(HttpClient);
  public APi_url = environments.baseUrl + '/github/'
  public getEntities(): Observable<Entity[]> {
    return this._genericClient.genericGet<{ results: Entity[] }>(this.APi_url + 'entity')?.pipe(
      delay(2000),
      map((res) => (res?.results?.length ? res.results : []))
    );
  }

  public getSearch(params?: FilterParams): Observable<any> {
    const apiUrl = `${this.APi_url}/search`;

    let httpParams = new HttpParams()
    if (params && params.page) {
      httpParams = httpParams.set('page', params?.page.toString());
    }

    if (params && params.limit) {
      httpParams = httpParams.set('limit', params?.limit.toString());
    }

    if (params && params.search) {
      httpParams = httpParams.set('query', params.search);
    }

    if (params && params.type) {
      httpParams = httpParams.set('type', params.type);
    }
    return this.httpClient.get(apiUrl, { params: httpParams }).pipe(
      delay(2000),
      map((response) => response)
    );
  }

  public getEndpointBasedOnEntity(entityName: string, params: FilterParams): Observable<any> {
    const apiUrl = `${this.APi_url}${'entity/'}${entityName}`;
    let httpParams = new HttpParams()
    if (params && params.page) {
      httpParams = httpParams.set('page', params?.page.toString());
    }
    if (params && params.limit) {
      httpParams = httpParams.set('limit', params?.limit.toString());
    }
    if (params.search) {
      httpParams = httpParams.set('search', params.search);
    }
    if (params.type) {
      httpParams = httpParams.set('type', params.type);
    }
    return this._genericClient.genericGet(apiUrl, { params: httpParams });
  }
}
