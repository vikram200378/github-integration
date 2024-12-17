import { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () =>
      import('./dashboard/dashboard').then((m) => m.DashboardComponent),
    title: 'Dashboard',
  },
] as Routes;
