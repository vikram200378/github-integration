import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { EntityType, FilterParams, GithubService } from './github.service';

@Injectable({
  providedIn: 'root',
})
export class GithubStoreService {
  private readonly _githubService = inject(GithubService);

  private _filterChange!: BehaviorSubject<boolean>;
  private _filterClean!: BehaviorSubject<boolean>;

  private _entity: EntityType = EntityType.author;
  private _search: string = '';

  constructor() {
    this._filterChange = new BehaviorSubject<boolean>(true);
    this._filterClean = new BehaviorSubject<boolean>(true);

    this.defaultValues();
  }

  public get filterChange(): Observable<boolean> {
    return this._filterChange?.asObservable();
  }

  public set filterChange(state: boolean) {
    this._filterChange.next(state);
  }

  public get filterClean(): Observable<boolean> {
    return this._filterClean?.asObservable();
  }

  public set filterClean(state: boolean) {
    if (state) {
      this.defaultValues();
    }

    this._filterClean.next(state);
  }

  public get entity() {
    return this._entity;
  }

  public set entity(value: EntityType) {
    this._entity = value;
    this.filterChange = true;
  }

  public get search() {
    return this._search;
  }

  public set search(value: string) {
    this._search = value;
    this.filterChange = true;
  }

  public defaultValues() {
    this._entity = EntityType.author;
    this._search = '';
  }

  public getEndpoint(params: FilterParams) {
    if (params?.search) {
      return this._githubService.getSearch(params);
    } else {
      return this._githubService.getEndpointBasedOnEntity(this.entity, params);
    }
  }
}
