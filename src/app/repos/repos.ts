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
import { MatDialog } from '@angular/material/dialog';
import dayjs from 'dayjs';

import { AuthorModalComponent } from './modal/author-modal.component';
ModuleRegistry.registerModules([AllCommunityModule]);
// import { MasterDetailModule } from 'ag-grid-enterprise';

// ModuleRegistry.registerModules([MasterDetailModule]);
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
  private readonly dialog = inject(MatDialog);
  public entityOptions: any[] = [];
  public entityLoading = false;
  public entityPage = 1;
  public entityTotalPages = 0;
  public filterForm = new FormGroup({
    activeIntegration: new FormControl('github'),
    entity: new FormControl(''),
    currentView: new FormControl(GithubDataType.commits),
    search: new FormControl(''),
  });
  public rowData: any[] = [];
  public themeClass = 'ag-theme-quartz';
  public detailCellRendererParams = {
    suppressCount: true,
    innerRenderer: EmployeeCellRenderer,
  };

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
  public groupDefaultExpanded = -1;
  public treeData = true;
  public dataLoading = false;
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
        ];
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
  // public fetchData(type: GithubDataType, search?: string) {
  //   this.dataLoading = true;
  //   this._githubService
  //     .getRepos<any[]>(type, this.pagination.page, this.pagination.limit, this.entityId?.value, search)
  //     ?.pipe(
  //       takeUntilDestroyed(this._destroyRef),
  //       tap({
  //         next: (res) => {
  //           // this._renderCols(type);
  //         },
  //       }),
  //       map((res: any) => {
  //         if (search) {
  //           res = {
  //             results: res?.[type]?.results,
  //             pagination: res?.[type]?.pagination,
  //           };
  //         }

  //         if (res?.results?.length) {
  //           const dynamicColumns = Object.keys(res.results[0]).map((key) => {
  //             const value = res.results[0][key];
  //             if (typeof value === 'object' || value === null || value === '') {
  //               return null;
  //             }
  //             if (key === 'html_url') {
  //               return {
  //                 headerName: this.formatHeaderName(key),
  //                 field: key,
  //                 filter: true,
  //                 width: 150,
  //                 cellRenderer: (params: any) => {
  //                   if (params.value) {
  //                     return `<a href="${params.value}" target="_blank" rel="noopener noreferrer">${params.value}</a>`;
  //                   }
  //                   return 'N/A';
  //                 },
  //               };
  //             }

  //             return {
  //               headerName: this.formatHeaderName(key),
  //               field: key,
  //               filter: true,
  //               width: 150,
  //             };
  //           }).filter(column => column !== null); // Remove null values

  //           if (res.results[0]?.head) {
  //             dynamicColumns.push(
  //               {
  //                 headerName: 'Base Branch',
  //                 field: 'base_label',
  //                 filter: true,
  //                 width: 150,
  //               },
  //               {
  //                 headerName: 'Head Branch',
  //                 field: 'head_label',
  //                 filter: true,
  //                 width: 150,
  //               }
  //             );
  //           }
  //           if (res.results[0]?.commit) {
  //             dynamicColumns.push({
  //               headerName: 'Commit Author',
  //               field: 'name',
  //               filter: true,
  //               width: 150,
  //             });
  //             dynamicColumns.push({
  //               headerName: 'Commit message',
  //               field: 'message',
  //               filter: true,
  //               width: 150,
  //             });

  //             dynamicColumns.push({
  //               headerName: 'Commit Date',
  //               field: 'commit_date',
  //               filter: true,
  //               width: 150,
  //             });


  //           }


  //           this.columnDefs = dynamicColumns;
  //           res.results = res.results.map((data: any) => {
  //             return this.mapDataToTableFormat(data);
  //           });
  //         }

  //         return res;
  //       })
  //     )
  //     .subscribe({
  //       next: (res) => {
  //         this.pagination.page = res?.pagination?.page;
  //         this.pagination.limit = res?.pagination?.limit;
  //         this.pagination.total = res?.pagination?.total;
  //         this.pagination.totalPages = res?.pagination?.totalPages;

  //         this.rowData = res?.results?.length ? res?.results : [];
  //         this.dataLoading = false;
  //       },
  //       error: (err) => {
  //         this.dataLoading = false;
  //         alert(err?.error?.message);
  //       },
  //     });
  // }
  // private formatHeaderName(key: string): string {
  //   return key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ');
  // }
  // private mapDataToTableFormat(data: any): any {
  //   const mappedData: any = {};
  //   Object.keys(data).forEach((key) => {
  //     if (key === 'base') {
  //       mappedData['base_label'] = data[key]?.label || 'N/A';
  //     } else if (key === 'head') {
  //       mappedData['head_label'] = data[key]?.label || 'N/A';
  //     } else if (key === 'created_at' || key === 'updated_at' || key === 'closed_at') {
  //       mappedData[key] = new Date(data[key]).toLocaleDateString();
  //     } else {
  //       mappedData[key] = data[key];
  //     }
  //   });
  //   mappedData['commit_date'] = new Date(data.commit?.author?.date).toLocaleDateString() || 'N/A';
  //   mappedData['name'] = data.commit?.author?.name || 'N/A';
  //   mappedData['message'] = data.commit?.message || 'N/A';
  //   mappedData['author_login'] = data.author?.login || 'Unknown';
  //   mappedData['author_avatar_url'] = data.author?.avatar_url || 'https://github.com/images/error/octocat_happy.gif';


  //   return mappedData;
  // }
  public fetchData(type: any, search?: string): void {
    this.dataLoading = true;

    this._githubService
      .getRepos<any[]>(type, this.pagination.page, this.pagination.limit, this.entityId?.value, search)
      ?.pipe(
        takeUntilDestroyed(this._destroyRef),
        map((res: any) => {
          if (res?.results?.length) {
            // Flatten the data for each row in the results
            
            this.columnDefs = this.generateDynamicColumns(res?.results[0]);
            res.results = res.results.map((data: any) => this.flattenData(data));
          }
          return res;
        })
      )
      .subscribe({
        next: (res) => {
          this.pagination = { ...this.pagination, ...res?.pagination };
          this.rowData = res?.results ?? []; // Bind the flattened data to ag-Grid


          this.dataLoading = false;
        },
        error: (err) => {
          this.dataLoading = false;
          alert(err?.error?.message);
        }
      });
  }
  private flattenData(data: any): any {
    const flatten = (obj: any, prefix: string = ''): any =>
      Object.keys(obj).reduce((acc, key) => {
        const prop = obj[key];
        const newKey = prefix
          ? `${prefix}_${key}`
          : key;
        if (typeof prop === 'object' && prop !== null) {
          return { ...acc, ...flatten(prop, newKey) };
        } else {
          return { ...acc, [newKey]: prop ?? 'NA' };
        }
      }, {});
  
    return flatten(data);
  }
  
  private generateDynamicColumns(firstRow: any): any[] {
    const flattenItem = this.flattenData(firstRow);
    console.log(flattenItem, 'Flattened Item');
  
    const columns = Object.keys(flattenItem).map((key: string) => {
      if (key === 'html_url') {
        return {
          headerName: this.formatHeaderName(key),
          field: key,
          cellRenderer: (params: any) => {
            return `<a href="${params.value}" target="_blank" rel="noopener noreferrer">${params.value}</a>`;
          },
          filter: true,
          width: 200,
        };
      }
  
      return {
        headerName: this.formatHeaderName(key),
        field: key,
        filter: true,
        width: 150,
      };
    });
  
    console.log('Generated Columns:', columns);
    return columns;
  }
  
  
  // Format header names into human-readable format
  private formatHeaderName(key: string): string {
    return key
      .split('.')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }


  public detailCellRenderer(params: any) {
    console.log(params, 'paramsparamsparamsparamsparams')
    const authorData = params.data;
    return `
      <div class="author-details">
        <h3>Author Details</h3>
        <div class="author-info">
          <img src="${authorData?.author_avatar_url || 'https://github.com/images/error/octocat_happy.gif'}" alt="Author Avatar" width="50" height="50">
          <p><strong>Login:</strong> ${authorData?.author_login || 'Unknown'}</p>
        </div>
        <div class="commit-details">
          <p><strong>Commit Date:</strong> ${authorData?.commit_date || 'Unknown'}</p>
        </div>
      </div>
    `;
  }
  onFirstDataRendered(params: any) {
    params.api.sizeColumnsToFit();
  }



  // public fetchData(type: GithubDataType, search?: string) {
  //   this.dataLoading = true;
  //   this._githubService
  //     .getRepos<any[]>(
  //       type,
  //       this.pagination.page,
  //       this.pagination.limit,
  //       this.entityId?.value,
  //       search
  //     )
  //     ?.pipe(
  //       takeUntilDestroyed(this._destroyRef),
  //       tap({
  //         next: (res) => {
  //           this._renderCols(type);
  //         },
  //       }),
  //       map((res: any) => {
  //         if (search) {
  //           res = {
  //             results: res?.[type]?.results,
  //             pagination: res?.[type]?.pagination,
  //           };
  //         }

  //         if (res?.results?.length) {
  //           res.results = res?.results?.map((data: any) => {
  //             if (type == GithubDataType.commits) {
  //               return {
  //                 commitId: data?.sha,
  //                 author_name: data?.commit?.author?.name,
  //                 author_email: data?.commit?.author?.email,
  //                 commit_date: data?.commit?.author?.date,
  //                 message: data?.commit?.message,
  //                 html_url: data?.html_url,
  //               };
  //             } else if (type == GithubDataType.pullRequests) {
  //               return {
  //                 id: data?.id,
  //                 title: data?.title,
  //                 assignee: data?.assignee,
  //                 state: data?.state,
  //                 closed_at: data?.closed_at,
  //                 updated_at: data?.updated_at,
  //                 repoName:data?.repoName
  //               };
  //             } else if (type == GithubDataType.issues) {
  //               return {
  //                 id: data?.id,
  //                 title: data?.title,
  //                 body: data?.body,
  //                 closed_by: data?.closed_by,
  //                 closed_at: data?.closed_at,
  //                 created_at: data?.created_at,
  //               };
  //             } else {
  //               return data;
  //             }
  //           });
  //         }

  //         return res;
  //       })
  //     )
  //     .subscribe({
  //       next: (res) => {
  //         this.pagination.page = res?.pagination?.page;
  //         this.pagination.limit = res?.pagination?.limit;
  //         this.pagination.total = res?.pagination?.total;
  //         this.pagination.totalPages = res?.pagination?.totalPages;

  //         this.rowData = res?.results?.length ? res?.results : [];
  //         this.dataLoading = false;
  //       },
  //       error: (err) => {
  //         this.dataLoading = false;
  //         alert(err?.error?.message);
  //       },
  //     });
  // }

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

  public onAutocompleteOpened(): void {
    const autocomplete = document.querySelector('.cdk-overlay-pane');
    if (autocomplete) {
      autocomplete.addEventListener('scroll', this.onScroll?.bind(this));
    }
  }

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
  public openAuthorModal(event: any): void {

    if (event.colDef.field === 'html_url') {
      return;
    } else {
      const clickedData = event.data
      console.log(clickedData,'clickedDataclickedDataclickedData')
      this.dialog.open(AuthorModalComponent, {
        data: clickedData,
      });
    }
  }

  //get entity id
  public get entityId() {
    return this.filterForm.controls?.entity as FormControl;
  }

  public dateFormatter(params: any): string {
    const date = params.value; // The cell value
    return date ? dayjs(date).format('MM-DD-YYYY hh:mm a') : '-';
  }

}
