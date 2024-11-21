import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard';

export default [
  {
    path: '',
    loadComponent: () =>
      import('./dashboard/dashboard').then((m) => m.DashboardComponent),
    title: 'Dashboard',
  },
] as Routes;
