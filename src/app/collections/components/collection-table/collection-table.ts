import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
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
    type: any;
  }>();

  public readonly statics = TableStatic;

  public handleCellClicked(event: any) {
    this.cellClickedEvent.emit(event);
  }

  constructor(){
    // this.adjustColumnSize();
  }

  ngOnInit() {
    this.setDefaultColumnWidths();
  }

  // Function to set default column width to 500px
  public setDefaultColumnWidths() {
    if (this.columnDefs && Array.isArray(this.columnDefs)) {
      this.columnDefs.forEach((col: any) => {
        col.width = 500;  // Set the default width of each column to 500px
      });
    }
  }
  public handlePageEvent(e: PageEvent) {
    const page = (e.pageIndex || 0) + 1;
    const limit = e.pageSize || 10;
    const type = this.label;
    this.paginationChanged.emit({
      page,
      limit,
      type,
    });
  }
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;

  // For dynamically setting the row height based on content
  public gridOptions = {
    getRowHeight: (params: any) => {
      return params.data && params.data.description && params.data.description.length > 50 ? 100 : 50;
    },
  };
  public adjustColumnSize() {
    setTimeout(() => {
      if (this.agGrid && this.agGrid.api) {
        this.agGrid.api.sizeColumnsToFit(); // Resize columns to fit the grid width
      }
    }, 0);
  }
}
