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
import { AgGridAngular } from 'ag-grid-angular';
import { EmployeeCellRenderer } from './cell-renderer/employee-cell-renderer';
import type { ColDef } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { GithubDataType, GithubService } from './services/github.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Pagination } from 'src/shared/interfaces';
import { tap } from 'rxjs';

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
  ],
})
export class ReposComponent implements OnInit {
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _githubService = inject(GithubService);

  public filterForm = new FormGroup({
    activeIntegration: new FormControl(''),
    entity: new FormControl<GithubDataType>(GithubDataType.repos),
    search: new FormControl(''),
  });

  public themeClass = 'ag-theme-quartz';

  public rowData: any[] = [];

  public autoGroupColumnDef: ColDef = {
    headerName: 'Employee',
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
  public pagination: Pagination = {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  };

  public columnDefs: ColDef[] = [];

  ngOnInit(): void {
    this.filterForm?.controls?.entity.valueChanges
      ?.pipe(takeUntilDestroyed(this._destroyRef))
      ?.subscribe((res) => {
        return this.fetchData(res as GithubDataType);
      });
  }

  public fetchData(type: GithubDataType) {
    this._githubService
      .getRepos<any[]>(type, this.pagination.page, this.pagination.limit)
      ?.pipe(
        takeUntilDestroyed(this._destroyRef),
        tap({
          next: (res) => {
            if (type == GithubDataType.repos) {
              this.columnDefs = [
                {
                  headerName: 'Ticket ID',
                  field: 'repoId',
                  width: 120,
                  filter: true,
                },
                {
                  field: 'author_name',
                  width: 250,
                  minWidth: 250,
                  flex: 1,
                  filter: true,
                },
                {
                  field: 'joinDate',
                  width: 180,
                  minWidth: 180,
                  flex: 1,
                  filter: true,
                },
                {
                  field: 'summary',
                  width: 200,
                  minWidth: 200,
                  flex: 1,
                  filter: true,
                },
                {
                  field: 'description',
                  width: 200,
                  minWidth: 200,
                  flex: 1,
                  filter: true,
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
          },
        })
      )
      .subscribe({
        next: (res) => {
          this.pagination.page = res?.pagination?.page;
          this.pagination.limit = res?.pagination?.limit;
          this.pagination.total = res?.pagination?.total;
          this.pagination.totalPages = res?.pagination?.totalPages;

          this.rowData = res?.results?.length ? res?.results : [];
        },
      });
  }

  public getDataPath = (data: any) => data.orgHierarchy;

  public handlePageEvent(e: PageEvent) {
    this.pagination.page = (e.pageIndex || 0) + 1;
    this.pagination.limit = e.pageSize || 10;
  }
}
