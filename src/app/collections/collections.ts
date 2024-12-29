import { Component, DestroyRef, inject } from '@angular/core';
import { FilterParams, GithubService, GithubStoreService } from './services';
import {
  CollectionsFilterComponent,
  CollectionTableComponent,
} from './components';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Pagination } from 'src/shared/interfaces';
import { flattenData, generateDynamicColumns } from './helpers';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import {
  catchError,
  EMPTY,
  switchMap,
} from 'rxjs';
import { GithubBehaviourService } from './behavior/behaviour';
@Component({
  selector: 'github-collections',
  standalone: true,
  imports: [
    CollectionsFilterComponent,
    CollectionTableComponent,
    MatCardModule,
    CommonModule,
  ],
  templateUrl: './collections.html',
  styleUrl: './collections.scss',
})
export class CollectionsComponent {
  private readonly _githubStoreService = inject(GithubStoreService);
  private readonly _githubService = inject(GithubService);
  private readonly _destroyRef = inject(DestroyRef);
  public tableConfigs: { [key: string]: any } = {};

  public pagination: Pagination = {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  };

  public type: any = '';
  public error: string = '';
  public loading: boolean = false;
  public resetValue: any
  private readonly _behaviour = inject(GithubBehaviourService);

  constructor() {
    this.fetchData();
  }


  public onPaginationChanged(event: { page: number; limit: number; type: any }) {
    const { page, limit, type } = event;
    if (type) {
      this.tableConfigs[type].pagination.page = page;
      this.tableConfigs[type].pagination.limit = limit;
      this._githubStoreService.type = type;
    }
  }

  public fetchData() {
    if (this.loading) return;
    this.loading = true;
    this._githubStoreService.filterChange
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        switchMap((state) => {
          if (state) {
            const params: FilterParams = this._githubStoreService.type ? {
              page: this._githubStoreService.type && this.tableConfigs[this._githubStoreService.type]
                ? this.tableConfigs[this._githubStoreService.type].pagination.page
                : this.pagination.page,
              limit: this._githubStoreService.type && this.tableConfigs[this._githubStoreService.type]
                ? this.tableConfigs[this._githubStoreService.type].pagination.limit
                : this.pagination.limit,
              ...(this._githubStoreService.type ? { type: this._githubStoreService.type } : {}),
            } : {};
            return this._githubStoreService
              .getEndpoint({ search: this._githubStoreService.search, ...params })
              .pipe(
                catchError((err) => {
                  this.error = err?.error?.message || 'Failed to fetch data';
                  return EMPTY;
                }),
              )

          } else {
            return EMPTY
          }

        }
        ),
      )
      .subscribe({
        next: (response: any) => {
          this._processFetchResponse(response, this._githubStoreService.type);
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
  }


  private _processFetchResponse(response: any, type: string | null) {
    const isSpecificType = !!type;
    if (isSpecificType && response[type!]) {
      const gridData = response[type!];
      if (gridData?.results && gridData.pagination) {
        this.tableConfigs[type!] = {
          ...this.tableConfigs[type!],
          rowData: gridData.results.map((data: any) => flattenData(data)) || [],
          columnDefs: gridData.results.length
            ? generateDynamicColumns(gridData.results[0])
            : [],
          pagination: gridData.pagination,
          dataLoading: false,
        };
      }
    } else if (!isSpecificType) {
      this.tableConfigs = {};
      for (const [key, value] of Object.entries(response) as any) {
        if (value?.results && value.pagination) {
          this.tableConfigs[key] = {
            label: value.label,
            type: value.type,
            columnDefs: generateDynamicColumns(value.results[0]),
            rowData: value.results.map((data: any) => flattenData(data)) || [],
            width: 500,
            pagination: value.pagination,
            dataLoading: false,
          };
        }
      }
    }
  }

  private _switchEndpoint() {
    this._setLoading(true);
    return this._githubStoreService.getEndpoint({
      page: this.pagination.page,
      limit: this.pagination.limit,
      search: this._githubStoreService?.search,
      type: this.type,
    });
  }

  private _setLoading(state: boolean = false) {
    if (this._githubStoreService.search) {
      this.loading = state;
    } else {
      this.loading = false;
    }
  }
}
