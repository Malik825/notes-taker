import { Routes } from '@angular/router';
import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';

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
  // Notes route with AppLayoutComponent
  {
    path: 'notes',
    loadComponent: () => import('./app-layout/app-layout.component').then(m => m.AppLayoutComponent),
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
  // Other authenticated routes without AppLayoutComponent
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./components/statistics-dashboard/statistics-dashboard.component').then(
      (m) => m.StatisticsDashboardComponent
    )
  },

  {
    path: 'settings',
    canActivate: [authGuard],
    loadComponent: () => import('./components/settings/settings.component').then(m => m.SettingsComponent)
  },
  // Wildcard route for 404
  { path: '**', redirectTo: 'welcome' }
];