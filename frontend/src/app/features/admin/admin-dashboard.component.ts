import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HotelService } from '../../core/services/hotel.service';
import { BookingService } from '../../core/services/booking.service';
import { Hotel, Booking } from '../../core/models/models';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="admin-container">
      <header>
        <h1>Admin Dashboard</h1>
        <button class="btn btn-add" (click)="showAddHotel = !showAddHotel">
          {{ showAddHotel ? 'Close' : 'Add New Hotel' }}
        </button>
      </header>

      <div *ngIf="showAddHotel" class="add-hotel-form">
        <h3>Add Hotel</h3>
        <form [formGroup]="hotelForm" (ngSubmit)="onAddHotel()">
          <div class="form-row">
            <input type="text" formControlName="name" placeholder="Hotel Name">
            <input type="text" formControlName="location" placeholder="Location">
          </div>
          <textarea formControlName="description" placeholder="Description"></textarea>
          <input type="text" formControlName="amenities" placeholder="Amenities (WiFi, AC, Pool, etc.)">
          <button type="submit" [disabled]="hotelForm.invalid" class="btn btn-primary">Save Hotel</button>
        </form>
      </div>

      <section class="hotels-list">
        <h2>Manage Hotels</h2>
        <div class="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Id</th>
                <th>Name</th>
                <th>Location</th>
                <th>Amenities</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let hotel of hotels">
                <td>{{ hotel.id }}</td>
                <td>{{ hotel.name }}</td>
                <td>{{ hotel.location }}</td>
                <td>{{ hotel.amenities }}</td>
                <td>
                  <button class="btn btn-danger" (click)="deleteHotel(hotel.id)">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="bookings-list">
        <h2>All Bookings</h2>
        <div class="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Token</th>
                <th>Hotel</th>
                <th>Room</th>
                <th>Dates</th>
                <th>Price</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let booking of bookings">
                <td>{{ booking.bookingToken }}</td>
                <td>{{ booking.hotelName }}</td>
                <td>{{ booking.roomType }}</td>
                <td>{{ booking.checkInDate | date }} - {{ booking.checkOutDate | date }}</td>
                <td>\${{ booking.totalPrice }}</td>
                <td><span class="status-badge">{{ booking.status }}</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .admin-container { padding: 2rem; }
    header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
    .add-hotel-form { background: #f8f9fa; padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem; border: 1px solid #ddd; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem; }
    input, textarea { width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; margin-bottom: 1rem; }
    table { width: 100%; border-collapse: collapse; background: white; }
    th, td { padding: 1rem; border: 1px solid #eee; text-align: left; }
    th { background: #f4f4f4; }
    .btn { padding: 0.5rem 1rem; border: none; border-radius: 4px; cursor: pointer; }
    .btn-add { background: #28a745; color: white; }
    .btn-primary { background: #007bff; color: white; }
    .btn-danger { background: #dc3545; color: white; }
    .status-badge { background: #e8f5e9; color: #2e7d32; padding: 0.25rem 0.5rem; border-radius: 4px; font-weight: bold; }
  `]
})
export class AdminDashboardComponent implements OnInit {
  private hotelService = inject(HotelService);
  private bookingService = inject(BookingService);
  private fb = inject(FormBuilder);

  hotels: Hotel[] = [];
  bookings: Booking[] = [];
  showAddHotel = false;

  hotelForm = this.fb.group({
    name: ['', Validators.required],
    location: ['', Validators.required],
    description: ['', Validators.required],
    amenities: ['', Validators.required]
  });

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.hotelService.getHotels().subscribe((h: any) => this.hotels = h);
    this.bookingService.getAllBookings().subscribe((b: any) => this.bookings = b);
  }

  onAddHotel() {
    if (this.hotelForm.valid) {
      this.hotelService.createHotel(this.hotelForm.value).subscribe(() => {
        this.loadData();
        this.hotelForm.reset();
        this.showAddHotel = false;
      });
    }
  }

  deleteHotel(id: number) {
    if (confirm('Are you sure you want to delete this hotel?')) {
      this.hotelService.deleteHotel(id).subscribe(() => this.loadData());
    }
  }
}
