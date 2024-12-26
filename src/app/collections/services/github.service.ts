import { HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { delay, map, Observable, of } from 'rxjs';
import { GenericClientService } from 'src/shared/services/generic';
import {
  getAuthorsData,
  getCommitList,
  getEntities,
  getIssuesList,
  getOrganisation,
  getPRList,
  getRepositoriesList,
  getSearchResult,
} from '../mock';
import {
  EntitiesResponse,
  Entity,
} from 'src/shared/interfaces/github/entities.interface';

export interface FilterParams {
  page: number;
  limit: number;
  search?: string;
  type?: string;
}

export enum EntityType {
  organisation = 1,
  author = 2,
  repository = 3,
  pullRequest = 4,
  commit = 5,
  issue = 6,
}

export enum CollectionType {
  commits = 'commits',
  pullRequests = 'pullRequests',
  issues = 'issues',
  repositories = 'repositories',
  authors = 'authors',
  organisation = 'organisation',
}

@Injectable({
  providedIn: 'root',
})
export class GithubService {
  // Generic Client
  private readonly _genericClient = inject(GenericClientService);

  // Get entities
  public getEntities(): Observable<Entity[]> {
    return of(getEntities() as unknown as EntitiesResponse)?.pipe(
      delay(2000),
      map((res) => (res?.results?.length ? res?.results : []))
    );
  }

  // Get Authors
  public getAuthors(params: FilterParams) {
    let httpParams = new HttpParams()
      ?.set('page', params?.page || 1)
      ?.set('limit', params?.limit || 10);

    if (params?.type) {
      httpParams = httpParams.append('type', params?.type);
    }

    return of(getAuthorsData())?.pipe(delay(2000));
  }

  // Get Organisation
  public getOrganisation(params: FilterParams) {
    let httpParams = new HttpParams()
      ?.set('page', params?.page || 1)
      ?.set('limit', params?.limit || 10);

    if (params?.type) {
      httpParams = httpParams.append('type', params?.type);
    }
    return of(getOrganisation())?.pipe(delay(2000));
  }

  // Get Pull Requests
  public getPullRequests(params: FilterParams) {
    let httpParams = new HttpParams()
      ?.set('page', params?.page || 1)
      ?.set('limit', params?.limit || 10);

    if (params?.type) {
      httpParams = httpParams.append('type', params?.type);
    }
    return of(getPRList())?.pipe(delay(2000));
  }

  // Get Commits
  public getCommits(params: FilterParams) {
    let httpParams = new HttpParams()
      ?.set('page', params?.page || 1)
      ?.set('limit', params?.limit || 10);

    if (params?.type) {
      httpParams = httpParams.append('type', params?.type);
    }
    return of(getCommitList())?.pipe(delay(2000));
  }

  // Get issues
  public getIssues(params: FilterParams) {
    let httpParams = new HttpParams()
      ?.set('page', params?.page || 1)
      ?.set('limit', params?.limit || 10);

    if (params?.type) {
      httpParams = httpParams.append('type', params?.type);
    }
    return of(getIssuesList())?.pipe(delay(2000));
  }

  // Get Repositories
  public getRepositories(params: FilterParams) {
    let httpParams = new HttpParams()
      ?.set('page', params?.page || 1)
      ?.set('limit', params?.limit || 10);

    if (params?.type) {
      httpParams = httpParams.append('type', params?.type);
    }
    return of(getRepositoriesList())?.pipe(delay(2000));
  }

  // Get search
  public getSearch(params: FilterParams) {
    let httpParams = new HttpParams()
      ?.set('page', params?.page || 1)
      ?.set('limit', params?.limit || 10);

    if (params?.search) {
      httpParams = httpParams.append('query', params?.search || '');
    }
    return of(getSearchResult())?.pipe(delay(2000));
  }

  public getEndpointBasedOnEntity(entityId: EntityType, params: FilterParams) {
    return entityId == EntityType.organisation
      ? this.getOrganisation(params)
      : entityId == EntityType.repository
      ? this.getRepositories(params)
      : entityId == EntityType.pullRequest
      ? this.getOrganisation(params)
      : entityId == EntityType.issue
      ? this.getIssues(params)
      : entityId == EntityType.author
      ? this.getAuthors(params)
      : this.getAuthors(params);
  }
}
