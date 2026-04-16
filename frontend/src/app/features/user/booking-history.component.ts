import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingService } from '../../core/services/booking.service';
import { Booking } from '../../core/models/models';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-booking-history',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="history-container">
      <header>
        <button class="btn btn-secondary" routerLink="/user">← Back to Search</button>
        <h1>My Booking History</h1>
      </header>

      <div *ngIf="bookings.length === 0" class="no-bookings">
        <p>You haven't made any bookings yet.</p>
        <button class="btn btn-primary" routerLink="/user">Start Booking</button>
      </div>

      <div class="booking-list" *ngIf="bookings.length > 0">
        <div *ngFor="let booking of bookings" class="history-card">
          <div class="card-header">
            <h3>{{ booking.hotelName }}</h3>
            <span class="token">{{ booking.bookingToken }}</span>
          </div>
          <div class="card-body">
            <div class="info">
              <p><span>Room:</span> {{ booking.roomType }}</p>
              <p><span>Dates:</span> {{ booking.checkInDate | date }} - {{ booking.checkOutDate | date }}</p>
            </div>
            <div class="price-box">
              <p>Total Paid</p>
              <p class="price">{{ booking.totalPrice | currency }}</p>
            </div>
          </div>
          <div class="card-footer">
            <span class="status-badge">{{ booking.status }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .history-container { padding: 2rem; max-width: 800px; margin: 0 auto; }
    header { display: flex; align-items: center; gap: 2rem; margin-bottom: 2rem; }
    .no-bookings { text-align: center; margin-top: 4rem; padding: 3rem; background: #f9f9f9; border-radius: 12px; }
    .booking-list { display: flex; flex-direction: column; gap: 1.5rem; }
    .history-card { background: white; border-radius: 12px; border: 1px solid #ddd; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
    .card-header { background: #f8f9fa; padding: 1rem 1.5rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #eee; }
    .card-header h3 { margin: 0; font-size: 1.2rem; }
    .token { font-family: monospace; background: #e9ecef; padding: 0.2rem 0.5rem; border-radius: 4px; font-weight: bold; font-size: 0.9rem; }
    .card-body { padding: 1.5rem; display: flex; justify-content: space-between; align-items: center; }
    .info p { margin: 0.5rem 0; color: #555; }
    .info span { font-weight: bold; color: #333; margin-right: 0.5rem; }
    .price-box { text-align: right; }
    .price-box p { margin: 0; color: #777; font-size: 0.8rem; }
    .price { color: #007bff; font-weight: bold; font-size: 1.4rem !important; }
    .card-footer { padding: 0.75rem 1.5rem; background: #fff; border-top: 1px dashed #eee; }
    .status-badge { background: #e8f5e9; color: #2e7d32; padding: 0.25rem 0.5rem; border-radius: 4px; font-weight: bold; font-size: 0.8rem; }
    .btn { padding: 0.5rem 1rem; border: none; border-radius: 4px; cursor: pointer; text-decoration: none; }
    .btn-primary { background: #007bff; color: white; }
    .btn-secondary { background: #6c757d; color: white; }
  `]
})
export class BookingHistoryComponent implements OnInit {
  private bookingService = inject(BookingService);
  bookings: Booking[] = [];

  ngOnInit() {
    this.bookingService.getMyBookings().subscribe((b: any) => this.bookings = b);
  }
}
