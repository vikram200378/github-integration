import { Component } from '@angular/core';
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
import { MatButtonModule } from '@angular/material/button';
import { AgGridAngular } from 'ag-grid-angular';
import { getData } from './data';
import { StatusCellRenderer } from './cell-renderer/status-cell-renderer';
import { EmployeeCellRenderer } from './cell-renderer/employee-cell-renderer';
import type { ColDef } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';

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
  ],
})
export class ReposComponent {
  public filterForm = new FormGroup({
    activeIntegration: new FormControl(''),
    entity: new FormControl(''),
    search: new FormControl(''),
  });

  public themeClass = 'ag-theme-quartz';

  public rowData = getData();

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

  public columnDefs: ColDef[] = [
    {
      headerName: 'Ticket ID',
      field: 'employeeId',
      width: 120,
      filter: true,
    },
    {
      field: 'user',
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
      filter: true
    },
    {
      field: 'summary',
      width: 200,
      minWidth: 200,
      flex: 1,
      filter: true,
    },
  ];

  public getDataPath = (data: any) => data.orgHierarchy;
}
