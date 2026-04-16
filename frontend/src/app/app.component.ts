import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  template: `
    <nav class="navbar" *ngIf="authService.currentUser$ | async as user">
      <div class="nav-brand" routerLink="/">🏨 HotelBooking</div>
      <div class="nav-links">
        <span class="user-info">Hello, <strong>{{ user.fullName }}</strong> ({{ user.role }})</span>
        <button class="btn-logout" (click)="logout()">Logout</button>
      </div>
    </nav>
    <main class="container">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .navbar { display: flex; justify-content: space-between; align-items: center; padding: 1rem 2rem; background: #333; color: white; }
    .nav-brand { font-size: 1.5rem; font-weight: bold; cursor: pointer; }
    .nav-links { display: flex; align-items: center; gap: 1.5rem; }
    .user-info { font-size: 0.9rem; }
    .btn-logout { background: #f44336; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; }
    .container { min-height: calc(100vh - 64px); background: #fdfdfd; }
  `]
})
export class AppComponent {
  authService = inject(AuthService);

  logout() {
    this.authService.logout();
  }
}
