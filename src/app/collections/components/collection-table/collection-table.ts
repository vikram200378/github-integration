import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { Pagination } from 'src/shared/interfaces';

ModuleRegistry.registerModules([AllCommunityModule]);

export const TableStatic = {
  pageSizeOptions: [10, 20, 25, 50],
  hidePageSize: false,
  disabled: false,
  showFirstLastButtons: false,
  themeClass: 'ag-theme-alpine',
};

@Component({
  selector: 'github-collection-table',
  standalone: true,
  templateUrl: './collection-table.html',
  styleUrl: './collection-table.scss',
  imports: [AgGridAngular, MatPaginatorModule],
})
export class CollectionTableComponent {
  @Input({ required: true }) label!: string;
  @Input({ required: true }) pagination!: Pagination;
  @Input({ required: true }) rowData: any = [];
  @Input({ required: true }) columnDefs: any;
  @Input() dataLoading: boolean = false;

  @Output() cellClickedEvent = new EventEmitter<any>();
  @Output() paginationChanged = new EventEmitter<{
    page: number;
    limit: number;
  }>();

  public readonly statics = TableStatic;

  public handleCellClicked(event: any) {
    this.cellClickedEvent.emit(event);
  }

  public handlePageEvent(e: PageEvent) {
    const page = (e.pageIndex || 0) + 1;
    const limit = e.pageSize || 10;

    this.paginationChanged.emit({
      page,
      limit,
    });
  }
}
