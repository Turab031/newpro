import { Routes } from '@angular/router';
import { RoleSelectionComponent } from './features/role-selection.component';
import { authGuard, adminGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', component: RoleSelectionComponent },
  {
    path: 'auth',
    children: [
      { path: 'login', loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent) },
      { path: 'register', loadComponent: () => import('./features/auth/register.component').then(m => m.RegisterComponent) }
    ]
  },
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./features/admin/admin-dashboard.component').then(m => m.AdminDashboardComponent)
  },
  {
    path: 'user',
    canActivate: [authGuard],
    children: [
      { path: '', loadComponent: () => import('./features/user/user-dashboard.component').then(m => m.UserDashboardComponent) },
      { path: 'details/:id', loadComponent: () => import('./features/user/hotel-details.component').then(m => m.HotelDetailsComponent) },
      { path: 'confirmation', loadComponent: () => import('./features/user/booking-confirmation.component').then(m => m.BookingConfirmationComponent) },
      { path: 'history', loadComponent: () => import('./features/user/booking-history.component').then(m => m.BookingHistoryComponent) }
    ]
  },
  { path: '**', redirectTo: '' }
];
