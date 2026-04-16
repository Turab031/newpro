import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-booking-confirmation',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="confirmation-container" *ngIf="booking">
      <div class="conf-card">
        <div class="icon-success">✔️</div>
        <h1>Booking Successful!</h1>
        <p>Thank you for booking with us. Your reservation is confirmed.</p>
        
        <div class="token-box">
          <p>YOUR UNIQUE BOOKING TOKEN</p>
          <h2 class="token">{{ booking.bookingToken }}</h2>
        </div>

        <div class="details">
          <div class="item"><span>Hotel:</span> <strong>{{ booking.hotelName }}</strong></div>
          <div class="item"><span>Room:</span> <strong>{{ booking.roomType }}</strong></div>
          <div class="item"><span>Dates:</span> <strong>{{ booking.checkInDate | date }} - {{ booking.checkOutDate | date }}</strong></div>
          <div class="item"><span>Total paid:</span> <strong class="price">{{ booking.totalPrice | currency }}</strong></div>
        </div>

        <div class="actions">
          <button class="btn btn-primary" routerLink="/user">Book Another</button>
          <button class="btn btn-secondary" routerLink="/user/history">View History</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .confirmation-container { display: flex; justify-content: center; align-items: center; padding: 4rem 2rem; }
    .conf-card { background: white; max-width: 500px; width: 100%; padding: 3rem; border-radius: 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); text-align: center; border: 1px solid #eee; }
    .icon-success { font-size: 5rem; color: #4caf50; margin-bottom: 1rem; }
    h1 { color: #2e7d32; margin-bottom: 1rem; }
    .token-box { background: #f1f8e9; padding: 1.5rem; border-radius: 12px; margin: 2rem 0; border: 2px dashed #4caf50; }
    .token-box p { font-size: 0.8rem; color: #555; margin-bottom: 0.5rem; letter-spacing: 1px; }
    .token { color: #1b5e20; margin: 0; font-family: 'Courier New', Courier, monospace; letter-spacing: 2px; }
    .details { text-align: left; margin-bottom: 2rem; background: #fafafa; padding: 1rem; border-radius: 8px; }
    .item { display: flex; justify-content: space-between; margin-bottom: 0.75rem; border-bottom: 1px solid #eee; padding-bottom: 0.5rem; }
    .price { color: #007bff; font-size: 1.2rem; }
    .actions { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .btn { padding: 0.75rem; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; text-decoration: none; }
    .btn-primary { background: #007bff; color: white; }
    .btn-secondary { background: #6c757d; color: white; }
  `]
})
export class BookingConfirmationComponent {
  private router = inject(Router);
  booking = this.router.getCurrentNavigation()?.extras.state?.['booking'];

  constructor() {
    if (!this.booking) {
      this.router.navigate(['/user']);
    }
  }
}
