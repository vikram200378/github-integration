import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AgGridAngular } from 'ag-grid-angular';
import { EmployeeCellRenderer } from './cell-renderer/employee-cell-renderer';
import type { ColDef } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { GithubDataType, GithubService } from './services/github.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Pagination } from 'src/shared/interfaces';
import { debounceTime, finalize, map, of, switchMap, tap } from 'rxjs';
import { NgFor, NgIf } from '@angular/common';

import dayjs from 'dayjs';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'git-repos',
  templateUrl: './repos.html',
  styleUrl: './repos.scss',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    AgGridAngular,
    MatPaginatorModule,
    MatAutocompleteModule,
    NgIf,
    NgFor,
    MatProgressSpinnerModule,
  ],
})
export class ReposComponent implements OnInit {
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _githubService = inject(GithubService);

  // Entity autocomplete
  public entityOptions: any[] = [];
  public entityLoading = false;
  public entityPage = 1;
  public entityTotalPages = 0;

  // Filter form group
  public filterForm = new FormGroup({
    activeIntegration: new FormControl('github'),
    entity: new FormControl(''),
    currentView: new FormControl(GithubDataType.commits),
    search: new FormControl(''),
  });

  // Row data
  public rowData: any[] = [];

  // Ag grid theme
  public themeClass = 'ag-theme-quartz';

  // Columns
  public autoGroupColumnDef: ColDef = {
    headerName: 'Repositories',
    width: 330,
    pinned: 'left',
    sort: 'asc',
    cellRenderer: 'agGroupCellRenderer',
    cellRendererParams: {
      suppressCount: true,
      innerRenderer: EmployeeCellRenderer,
    },
  };

  // Expand state
  public groupDefaultExpanded = -1;

  // Tree Data
  public treeData = true;

  // Data laoding
  public dataLoading = false;

  // Table pagination
  public pagination: Pagination = {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  };

  // Cols
  public columnDefs: ColDef[] = [];

  ngOnInit(): void {
    this.fetchRepos()
      ?.pipe(takeUntilDestroyed(this._destroyRef))
      ?.subscribe((data) => {
        this.entityOptions = [
          ...this.entityOptions,
          ...(data?.results?.length ? data?.results : []),
        ]; // Append new items
        this.entityLoading = false;
      });

    this._handleEntitySearch();

    this.filterForm?.controls?.currentView?.valueChanges
      ?.pipe(takeUntilDestroyed(this._destroyRef))
      ?.subscribe((res) => {
        if (res && (this.entityId?.value || this.filterForm?.value?.search)) {
          return this.fetchData(
            res as GithubDataType,
            this.filterForm?.value?.search || ''
          );
        }
      });

    this.filterForm?.controls?.search?.valueChanges
      ?.pipe(debounceTime(1000))
      .subscribe((value) => {
        this.fetchData(GithubDataType?.commits, value || '');
      });
  }

  public fetchData(type: GithubDataType, search?: string) {
    this.dataLoading = true;
    this._githubService
      .getRepos<any[]>(
        type,
        this.pagination.page,
        this.pagination.limit,
        this.entityId?.value,
        search
      )
      ?.pipe(
        takeUntilDestroyed(this._destroyRef),
        tap({
          next: (res) => {
            this._renderCols(type);
          },
        }),
        map((res: any) => {
          if (search) {
            res = {
              results: res?.[type]?.results,
              pagination: res?.[type]?.pagination,
            };
          }

          if (res?.results?.length) {
            res.results = res?.results?.map((data: any) => {
              if (type == GithubDataType.commits) {
                return {
                  commitId: data?.sha,
                  author_name: data?.commit?.author?.name,
                  author_email: data?.commit?.author?.email,
                  commit_date: data?.commit?.author?.date,
                  message: data?.commit?.message,
                  html_url: data?.html_url,
                };
              } else if (type == GithubDataType.pullRequests) {
                return {
                  id: data?.id,
                  title: data?.title,
                  assignee: data?.assignee,
                  state: data?.state,
                  closed_at: data?.closed_at,
                  updated_at: data?.updated_at,
                };
              } else if (type == GithubDataType.issues) {
                return {
                  id: data?.id,
                  title: data?.title,
                  body: data?.body,
                  closed_by: data?.closed_by,
                  closed_at: data?.closed_at,
                  created_at: data?.created_at,
                };
              } else {
                return data;
              }
            });
          }

          return res;
        })
      )
      .subscribe({
        next: (res) => {
          this.pagination.page = res?.pagination?.page;
          this.pagination.limit = res?.pagination?.limit;
          this.pagination.total = res?.pagination?.total;
          this.pagination.totalPages = res?.pagination?.totalPages;

          this.rowData = res?.results?.length ? res?.results : [];
          this.dataLoading = false;
        },
        error: (err) => {
          this.dataLoading = false;
          alert(err?.error?.message);
        },
      });
  }

  // Handle entity search
  private _handleEntitySearch() {
    this.entityId?.valueChanges
      ?.pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (value) => {
          if (value) {
            this.filterForm?.controls?.search?.setValue('');
            this.filterForm?.controls?.currentView?.setValue(
              GithubDataType?.commits,
              { emitEvent: true }
            );
          }
        },
      });
  }

  // Fetch Repos
  public fetchRepos(searchQuery?: string) {
    return this._githubService.getRepos<any[]>(
      GithubDataType.repos,
      this.entityPage,
      10
    );
  }

  public handlePageEvent(e: PageEvent) {
    this.pagination.page = (e.pageIndex || 0) + 1;
    this.pagination.limit = e.pageSize || 10;
    this.fetchData(
      this.filterForm?.value?.currentView as GithubDataType,
      this.filterForm?.value?.search || ''
    );
  }

  // Entity Autocomplete events

  // On scroll event to fetch more entity data
  public onAutocompleteOpened(): void {
    const autocomplete = document.querySelector('.cdk-overlay-pane');
    if (autocomplete) {
      autocomplete.addEventListener('scroll', this.onScroll?.bind(this));
    }
  }

  // Entity autocomplete on scroll
  public onScroll(event: any): void {
    const { scrollTop, scrollHeight, clientHeight } = event.target;
    if (
      scrollTop + clientHeight >= scrollHeight - 100 &&
      this.entityPage < this.entityTotalPages
    ) {
      this.entityPage++;
      this.entityLoading = true;
      this.fetchRepos()
        ?.pipe(takeUntilDestroyed(this._destroyRef))
        ?.subscribe((data) => {
          this.entityOptions = [
            ...this.entityOptions,
            ...(data?.results?.length ? data?.results : []),
          ]; // Append new items
          this.entityLoading = false;
        });
    }
  }

  private _renderCols(type: GithubDataType) {
    if (type == GithubDataType.commits) {
      this.columnDefs = [
        {
          headerName: 'Commit ID',
          field: 'commitId',
          width: 120,
          filter: true,
          cellRenderer: (params: any) => {
            // Create a link element with the URL in the 'website' field
            return `<a href="${params.data.html_url}" target="_blank">${params.value}</a>`;
          },
        },
        {
          field: 'author_name',
          width: 250,
          minWidth: 250,
          flex: 1,
          filter: true,
        },
        {
          field: 'author_email',
          width: 250,
          minWidth: 250,
          flex: 1,
          filter: true,
        },
        {
          field: 'commit_date',
          width: 180,
          minWidth: 180,
          flex: 1,
          filter: true,
          valueFormatter: this.dateFormatter,
        },
        {
          field: 'message',
          width: 200,
          minWidth: 200,
          flex: 1,
          filter: true,
        },
      ];
    }

    if (type == GithubDataType.pullRequests) {
      this.columnDefs = [
        {
          headerName: 'Pull Request ID',
          field: 'id',
          width: 120,
          filter: true,
        },
        {
          field: 'title',
          width: 200,
          minWidth: 200,
          flex: 1,
          filter: true,
        },
        {
          field: 'assignee',
          width: 250,
          minWidth: 250,
          flex: 1,
          filter: true,
        },
        {
          field: 'state',
          width: 250,
          minWidth: 250,
          flex: 1,
          filter: true,
          valueFormatter: (params: any) => params?.value?.toUpperCase() || '-',
        },
        {
          field: 'closed_at',
          width: 180,
          minWidth: 180,
          flex: 1,
          filter: true,
          valueFormatter: this.dateFormatter,
        },
        {
          field: 'updated_at',
          width: 180,
          minWidth: 180,
          flex: 1,
          filter: true,
          valueFormatter: this.dateFormatter,
        },
      ];
    }

    if (type == GithubDataType.issues) {
      this.columnDefs = [
        {
          headerName: 'Issue ID',
          field: 'id',
          width: 120,
          filter: true,
        },
        {
          field: 'title',
          width: 200,
          minWidth: 200,
          flex: 1,
          filter: true,
        },
        {
          field: 'body',
          width: 250,
          minWidth: 250,
          flex: 1,
          filter: true,
        },
        {
          field: 'closed_by',
          width: 250,
          minWidth: 250,
          flex: 1,
          filter: true,
          valueFormatter: (params: any) => params?.value?.toUpperCase() || '-',
        },
        {
          field: 'closed_at',
          width: 180,
          minWidth: 180,
          flex: 1,
          filter: true,
          valueFormatter: this.dateFormatter,
        },
        {
          field: 'created_at',
          width: 180,
          minWidth: 180,
          flex: 1,
          filter: true,
          valueFormatter: this.dateFormatter,
        },
      ];
    }
  }

  //get entity id
  public get entityId() {
    return this.filterForm.controls?.entity as FormControl;
  }

  public dateFormatter(params: any): string {
    const date = params.value; // The cell value
    return date ? dayjs(date).format('MM-DD-YYYY hh:mm a') : '-'; // Format or return an empty string
  }
}
