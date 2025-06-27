import { Routes } from '@angular/router';
import { authGuard } from './components/auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'welcome',
    pathMatch: 'full'
  },
  {
    path: 'welcome',
    loadComponent: () => import('./components/welcome/welcome.component').then(m => m.WelcomeComponent)
  },
  {
    path: 'notes',
    loadComponent: () => import('./components/app-layout/app-layout.component').then(m => m.AppLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./components/notedashboard/notes-dashboard.component').then(m => m.NotesDashboardComponent)
      },
      {
        path: ':id',
        loadComponent: () => import('./components/note-details/note-details.component').then(m => m.NoteDetailsComponent)
      },
      {
        path: ':id/edit',
        loadComponent: () => import('./components/noteeditor/note-editor.component').then(m => m.NoteEditorModalComponent)
      }
    ]
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./components/statistics-dashboard/statistics-dashboard.component').then(m => m.StatisticsDashboardComponent)
      },
      {
        path: 'archives',
        loadComponent: () => import('./components/archived/archived.component').then(m => m.ArchivedComponent)
      },
      {
        path: 'settings',
        loadComponent: () => import('./components/settings/settings.component').then(m => m.SettingsComponent)
      }
    ]
  },
  {
    path: 'settings',
    canActivate: [authGuard],
    loadComponent: () => import('./components/settings/settings.component').then(m => m.SettingsComponent)
  },
  {
    path: 'archive',
    loadComponent: () => import('./components/archived/archived.component').then(m => m.ArchivedComponent)
  },
  {
    path: '**',
    redirectTo: 'welcome'
  }
];