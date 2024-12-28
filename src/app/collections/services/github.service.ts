import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { delay, map, Observable, of } from 'rxjs';
import { GenericClientService } from 'src/shared/services/generic';
import { getEntities, getSearchResult } from '../mock'; // Mock data if needed
import { EntitiesResponse, Entity } from 'src/shared/interfaces/github/entities.interface';

export interface FilterParams {
  page: number;
  limit: number;
  search?: string;
  type?: string;
}

@Injectable({
  providedIn: 'root',
})
export class GithubService {
  private readonly _genericClient = inject(GenericClientService);
  private readonly httpClient = inject(HttpClient); // Inject HttpClient to make HTTP requests

  // Get entities (mocked data for demonstration)
  public getEntities(): Observable<Entity[]> {
    return of(getEntities() as unknown as EntitiesResponse)?.pipe(
      delay(2000),
      map((res) => (res?.results?.length ? res?.results : []))
    );
  }

  // Global search based on search term and other filters
  public getSearch(params: FilterParams): Observable<any> {
    const apiUrl = `https://api.github.com/search`; // Replace with actual search API base URL

    // Prepare query parameters for search
    let httpParams = new HttpParams()
      .set('page', params.page.toString())
      .set('limit', params.limit.toString());

    if (params.search) {
      httpParams = httpParams.set('query', params.search); // Search term
    }

    if (params.type) {
      httpParams = httpParams.set('type', params.type); // Filter type (optional)
    }

    // Make the HTTP request to the global search endpoint
    return this.httpClient.get(apiUrl, { params: httpParams }).pipe(
      delay(2000), // Simulate delay for demo purposes (can be removed)
      map((response) => response) // Process the response if needed
    );
  }

  // Dynamic API call based on the selected entity and params (can be kept for other future dynamic use)
  public getEndpointBasedOnEntity(entityName: string, params: FilterParams): Observable<any> {
     console.log(entityName,'entityNameentityNameentityName')
    const apiUrl = `https://api.github.com/${entityName}`; // Replace with actual base API URL

    // Prepare query parameters
    let httpParams = new HttpParams()
      .set('page', params.page.toString())
      .set('limit', params.limit.toString());

    if (params.search) {
      httpParams = httpParams.set('search', params.search);
    }

    if (params.type) {
      httpParams = httpParams.set('type', params.type);
    }

    // Make the HTTP request to the dynamic endpoint
    return this._genericClient.genericGet(apiUrl, { params: httpParams });
  }
}
