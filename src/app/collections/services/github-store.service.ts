import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FilterParams, GithubService } from './github.service';

@Injectable({
  providedIn: 'root',
})
export class GithubStoreService {
  private readonly _githubService = inject(GithubService);
  private _filterChange!: BehaviorSubject<boolean>;
  private _filterClean!: BehaviorSubject<boolean>;

  private _entity: string = 'author';
  private _search: string = '';
  private _type: string = '';

  constructor() {
    this._filterChange = new BehaviorSubject<boolean>(false);
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

  public get type() {
    return this._type;
  }

  public set type(value: string) {
    this._type = value;
    this.filterChange = true;
  }

  public get entity() {
    return this._entity;
  }

  public set entity(value: string) {
    this._type = ''
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
    this._entity = 'author'; // Default to 'author'
    this._search = '';
    this._type = '';
  }

  // Method to get data based on search or entity
  public getEndpoint(params: FilterParams): Observable<any> {
    if (params?.search) {
      // If search is provided, call global search
      return this._githubService.getSearch(params);
    } else {
      // Otherwise, call dynamic API based on the selected entity
      return this._githubService.getEndpointBasedOnEntity(this.entity, params);
    }
  }
}
