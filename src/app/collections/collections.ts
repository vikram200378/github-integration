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
  interval,
  map,
  Observable,
  of,
  switchMap,
  throwError,
} from 'rxjs';
import { GithubBehaviourService } from './behavior/behaviour';

const PaginationStatic = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
};

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
  // Services
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

  public type: string = '';
  public error: string = '';
  public loading: boolean = false;
  public resetValue: any
  private readonly _behaviour = inject(GithubBehaviourService);
  constructor() {
    this.fetchData(null);
    this._behaviour.selectedEntity$.subscribe((res: any) => {
      if(res){
        this.resetValue = res;
      }else{
        this.resetValue = null;
      }
    });
  }

  public onPaginationChanged(event: { page: number; limit: number; type: any }) {
    const { page, limit, type } = event;
    if (type) {
      this.resetValue = null
      this.tableConfigs[type].pagination.page = page;
      this.tableConfigs[type].pagination.limit = limit;
      this.type = type; 
      this.fetchData(type);
    }else{
      this.pagination.page = page;
      this.pagination.limit = limit;
      this.fetchData(null);
    }

  }

  public fetchData(type: string | null = null) {
    const isSpecificType = !!type;
    const defaultPagination = { page: 1, limit: 10 };
    const params: FilterParams = {
      page: isSpecificType
        ? this.tableConfigs[type!].pagination.page
        : this.pagination.page || defaultPagination.page,
      limit: isSpecificType
        ? this.tableConfigs[type!].pagination.limit
        : this.pagination.limit || defaultPagination.limit,
        ...(type ? { type } : {}),
        // Include type if it's provided
    };
    console.log('Params constructed:', params);
    // Fetch data from the API based on the current params
    this._githubStoreService.filterChange
      .pipe(
        switchMap((state) =>
          state
            ? this._githubStoreService.getEndpoint({
              search: this._githubStoreService?.search,
              ...params,
            })
            : EMPTY
        ),
        catchError((err) => {
          return throwError(() => err);
        })
      )
      .subscribe({
        next: (response: any) => {
          if (isSpecificType && response[type!]) {
            const gridData = response[type!];
            if (
              typeof gridData === 'object' &&
              gridData !== null &&
              'results' in gridData &&
              'pagination' in gridData
            ) {
              const results = gridData.results;
              this.tableConfigs[type!] = {
                ...this.tableConfigs[type!],
                rowData: results?.length
                  ? results.map((data: any) => flattenData(data))
                  : [],
                columnDefs: results?.length
                  ? generateDynamicColumns(results[0])
                  : [],
                pagination: gridData.pagination,
                dataLoading: false,
              };
            }
          }

          if (!isSpecificType) {
            this.tableConfigs = {};
            for (const [key, value] of Object.entries(response)) {
              if (
                typeof value === 'object' &&
                value !== null &&
                'results' in value &&
                'pagination' in value
              ) {
                const results = (value as any).results;
                this.tableConfigs[key] = {
                  label: key,
                  columnDefs: results?.length
                    ? generateDynamicColumns(results[0])
                    : [],
                  rowData: results?.length
                    ? results.map((data: any) => flattenData(data))
                    : [],
                  width: 500,
                  pagination: value.pagination || {
                    page: 1,
                    limit: 10,
                    total: 0,
                    totalPages: 0,
                  },
                  dataLoading: false,
                };
              }
            }
          }

          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
          this.error =
            err?.error?.message ||
            'Unable to process your request to fetch data';
          console.error(err?.error?.message);
        },
      });
  }


  // public onPaginationChanged(event: {
  //   page: number;
  //   limit: number;
  //   type: any;
  // }) 
  // {

  //   console.log(event,'eventeventevent')
  //   const { page, limit, type } = event;
  //   this.pagination.page = page;
  //   this.pagination.limit = limit;
  //   this.type = type;
  //   this.fetchData( this.type);
  // }


  // public fetchData(type: string | null = null) {

  //   const isSpecificType = !!type;

  // // Prepare query params
  // const params: FilterParams = {
  //   page: isSpecificType
  //     ? this.tableConfigs[type!].pagination.page
  //     : this.pagination.page,
  //   limit: isSpecificType
  //     ? this.tableConfigs[type!].pagination.limit
  //     : this.pagination.limit,
  //   ...(type ? { type } : {}), // Include type only if provided
  // };

  //   this._githubStoreService.filterChange
  //     .pipe(
  //       switchMap((state) =>
  //         state
  //           ? this._githubStoreService.getEndpoint({
  //               search: this._githubStoreService?.search,
  //               ...params,
  //             })
  //           : EMPTY
  //       ),
  //       catchError((err) => {
  //         return throwError(() => err);
  //       })
  //     )
  //     .subscribe({
  //       next: (response: any) => {
  //         this.tableConfigs = {}; // Reset table configs
  //         for (const [key, value] of Object.entries(response)) {
  //           if (
  //             typeof value === 'object' &&
  //             value !== null &&
  //             'results' in value &&
  //             'pagination' in value
  //           ) {
  //             const results = (value as any).results;
  //             this.tableConfigs[key] = {
  //               label: key,
  //               columnDefs: results?.length
  //                 ? generateDynamicColumns(results[0])
  //                 : [],
  //               rowData: results?.length
  //                 ? results.map((data: any) => flattenData(data))
  //                 : [],
  //               pagination: value.pagination || {
  //                 page: 1,
  //                 limit: 10,
  //                 total: 0,
  //                 totalPages: 0,
  //               },
  //               dataLoading: false,
  //             };
  //           }
  //         }
  //         this.loading = false;
  //       },
  //       error: (err) => {
  //         this.loading = false;
  //         this.error =
  //           err?.error?.message ||
  //           'Unable to process your request to fetch data';
  //         console.error(err?.error?.message);
  //       },
  //     });
  // }
  trackByKey(index: number, item: { key: string; value: any }): string {
    return item.key;
  }

  // public fetchData() {
  //   this._githubStoreService?.filterChange
  //     ?.pipe(
  //       takeUntilDestroyed(this._destroyRef),
  //       switchMap(() => this._switchEndpoint())
  //     )
  //     .subscribe({
  //       next: (res: any) => {
  //         if (res?.commits) {
  //           const response = res?.commits;
  //           this.commitsCols = generateDynamicColumns(response?.results?.[0]);
  //           this.commitsRows = response?.results?.length
  //             ? response?.results?.map((data: any) => flattenData(data))
  //             : [];
  //           this.commitsPagination = response?.pagination;
  //         }

  //         if (res?.pullRequests) {
  //           const response = res?.pullRequests;
  //           this.pullRequestsCols = generateDynamicColumns(
  //             response?.results?.[0]
  //           );
  //           this.pullRequestsCols = response?.results?.length
  //             ? response?.results?.map((data: any) => flattenData(data))
  //             : [];
  //           this.pullRequestsPagination = response?.pagination;
  //         }

  //         if (res?.organisation) {
  //           const response = res?.organisation;
  //           this.organisationCols = generateDynamicColumns(
  //             response?.results?.[0]
  //           );
  //           this.organisationRows = response?.results?.length
  //             ? response?.results?.map((data: any) => flattenData(data))
  //             : [];
  //           this.organisationPagination = response?.pagination;
  //         }

  //         if (res?.issues) {
  //           const response = res?.issues;
  //           this.issuesCols = generateDynamicColumns(response?.results?.[0]);
  //           this.issuesRows = response?.results?.length
  //             ? response?.results?.map((data: any) => flattenData(data))
  //             : [];
  //           this.issuesPagination = response?.pagination;
  //         }

  //         if (res?.repositories) {
  //           const response = res?.repositories;
  //           this.repositoriesCols = generateDynamicColumns(
  //             response?.results?.[0]
  //           );
  //           this.repositoriesRows = response?.results?.length
  //             ? response?.results?.map((data: any) => flattenData(data))
  //             : [];
  //           this.repositoriesPagination = response?.pagination;
  //         }

  //         if (res?.authors) {
  //           const response = res?.authors;
  //           this.authorsCols = generateDynamicColumns(response?.results?.[0]);
  //           this.authorsRows = response?.results?.length
  //             ? response?.results?.map((data: any) => flattenData(data))
  //             : [];
  //           this.authorsPagination = response?.pagination;
  //         }

  //         this._setLoading(false);
  //       },
  //       error: (err) => {
  //         this._setLoading(false);
  //         this.error =
  //           err?.error?.message ||
  //           'Unable to process your request to fetch data';
  //         console.error(err?.error?.message);
  //       },
  //     });
  // }

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
      // this.organisationLoading = false;
      // this.pullRequestsLoading = false;
      // this.issuesLoading = false;
      // this.commitsLoading = false;
      // this.repositoriesLoading = false;
      // this.authorsLoading = false;
    } else {
      this.loading = false;
      // this.organisationLoading =
      //   this.type == CollectionType.authors ? state : false;
      // this.pullRequestsLoading =
      //   this.type == CollectionType.pullRequests ? state : false;
      // this.issuesLoading = this.type == CollectionType.issues ? false : state;
      // this.commitsLoading = this.type == CollectionType.commits ? false : state;
      // this.repositoriesLoading =
      //   this.type == CollectionType.repositories ? false : state;
      // this.authorsLoading = this.type == CollectionType.authors ? false : state;
    }
  }
}
