import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-role-selection',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="selection-container">
      <h1>Welcome to Hotel Booking System</h1>
      <p>Please select your role to continue</p>
      
      <div class="cards">
        <div class="card admin" (click)="selectRole('Admin')">
          <i class="fas fa-user-shield"></i>
          <h2>Admin</h2>
          <p>Manage hotels, rooms, and view all bookings.</p>
        </div>
        
        <div class="card user" (click)="selectRole('User')">
          <i class="fas fa-user"></i>
          <h2>User</h2>
          <p>Search and book your favorite hotels.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .selection-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 80vh;
      text-align: center;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    .cards {
      display: flex;
      gap: 2rem;
      margin-top: 2rem;
    }
    .card {
      width: 250px;
      padding: 2rem;
      border: 2px solid #ddd;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s ease;
      background: white;
    }
    .card:hover {
      transform: translateY(-10px);
      box-shadow: 0 10px 20px rgba(0,0,0,0.1);
      border-color: #007bff;
    }
    .admin:hover { border-color: #dc3545; }
    .user:hover { border-color: #007bff; }
    i { font-size: 3rem; margin-bottom: 1rem; }
    h2 { margin: 0.5rem 0; }
    p { color: #666; }
  `]
})
export class RoleSelectionComponent {
  private router = inject(Router);

  selectRole(role: string) {
    // Store selected role preference or just navigate
    localStorage.setItem('selectedRole', role);
    this.router.navigate(['/auth/login']);
  }
}
