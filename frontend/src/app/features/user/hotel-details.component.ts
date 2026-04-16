import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HotelService } from '../../core/services/hotel.service';
import { BookingService } from '../../core/services/booking.service';
import { Hotel, RoomCategory } from '../../core/models/models';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-hotel-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="details-container" *ngIf="hotel">
      <header>
        <button class="btn btn-secondary" routerLink="/user">← Back to Search</button>
        <h1>{{ hotel.name }}</h1>
      </header>

      <div class="hotel-info">
        <div class="main-info">
          <h3>📍 {{ hotel.location }}</h3>
          <p class="description">{{ hotel.description }}</p>
          <div class="amenities-box">
            <h4>Amenities</h4>
            <div class="amenity-tags">
              <span *ngFor="let tag of hotel.amenities.split(',')" class="tag">{{ tag.trim() }}</span>
            </div>
          </div>
        </div>

        <div class="booking-section">
          <h3>Book a Room</h3>
          <form [formGroup]="bookingForm" (ngSubmit)="onBook()">
            <div class="form-group">
              <label>Select Room Category</label>
              <select formControlName="roomCategoryId" class="form-control">
                <option value="" disabled>Choose a room</option>
                <option *ngFor="let room of hotel.roomCategories" [value]="room.id" [disabled]="room.availableRooms <= 0">
                  {{ room.type }} - {{ room.pricePerNight | currency }}/night ({{ room.availableRooms }} left)
                </option>
              </select>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label>Check-in</label>
                <input type="date" formControlName="checkInDate" class="form-control">
              </div>
              <div class="form-group">
                <label>Check-out</label>
                <input type="date" formControlName="checkOutDate" class="form-control">
              </div>
            </div>

            <div class="price-summary" *ngIf="totalPrice > 0">
              <p>Total Price: <strong>{{ totalPrice | currency }}</strong></p>
            </div>

            <button type="submit" [disabled]="bookingForm.invalid || isBooking" class="btn btn-primary btn-lg">
              {{ isBooking ? 'Processing...' : 'Confirm Booking' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .details-container { padding: 2rem; max-width: 1000px; margin: 0 auto; }
    header { display: flex; align-items: center; gap: 2rem; margin-bottom: 2rem; }
    .hotel-info { display: grid; grid-template-columns: 1.5fr 1fr; gap: 3rem; }
    .description { line-height: 1.6; color: #444; margin: 1.5rem 0; }
    .amenity-tags { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 1rem; }
    .tag { background: #e3f2fd; color: #0d47a1; padding: 0.4rem 0.8rem; border-radius: 20px; font-size: 0.85rem; font-weight: bold; }
    .booking-section { background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); border: 1px solid #ddd; height: fit-content; }
    .form-group { margin-bottom: 1.5rem; }
    .form-control { width: 100%; padding: 0.75rem; border: 1px solid #ccc; border-radius: 6px; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .price-summary { background: #f1f8e9; padding: 1rem; border-radius: 6px; margin-bottom: 1.5rem; border: 1px dashed #4caf50; }
    .btn-lg { width: 100%; padding: 1rem; font-size: 1.1rem; font-weight: bold; border: none; border-radius: 6px; cursor: pointer; background: #007bff; color: white; }
    .btn-secondary { padding: 0.5rem 1rem; background: #eee; border: none; border-radius: 4px; cursor: pointer; }
  `]
})
export class HotelDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private hotelService = inject(HotelService);
  private bookingService = inject(BookingService);
  private fb = inject(FormBuilder);

  hotel: Hotel | null = null;
  isBooking = false;
  totalPrice = 0;

  bookingForm = this.fb.group({
    roomCategoryId: ['', Validators.required],
    checkInDate: ['', Validators.required],
    checkOutDate: ['', Validators.required]
  });

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.hotelService.getHotel(id).subscribe((h: any) => this.hotel = h);

    this.bookingForm.valueChanges.subscribe(() => this.calculatePrice());
  }

  calculatePrice() {
    const { roomCategoryId, checkInDate, checkOutDate } = this.bookingForm.value;
    if (roomCategoryId && checkInDate && checkOutDate) {
      const room = this.hotel?.roomCategories.find(r => r.id === Number(roomCategoryId));
      const start = new Date(checkInDate);
      const end = new Date(checkOutDate);
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24));
      
      if (room && days > 0) {
        this.totalPrice = room.pricePerNight * days;
      } else {
        this.totalPrice = 0;
      }
    }
  }

  onBook() {
    if (this.bookingForm.valid && this.hotel) {
      this.isBooking = true;
      const request = {
        hotelId: this.hotel.id,
        roomCategoryId: Number(this.bookingForm.value.roomCategoryId),
        checkInDate: this.bookingForm.value.checkInDate!,
        checkOutDate: this.bookingForm.value.checkOutDate!
      };

      this.bookingService.createBooking(request).subscribe({
        next: (res: any) => {
          this.router.navigate(['/user/confirmation'], { state: { booking: res } });
        },
        error: (err: any) => {
          this.isBooking = false;
          alert('Booking failed: ' + (err.error?.message || 'Request failed'));
        }
      });
    }
  }
}
