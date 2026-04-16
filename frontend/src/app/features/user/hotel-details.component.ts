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
          <div class="amenities-box" *ngIf="hotel.amenities">
            <h4>Amenities</h4>
            <div class="amenity-tags">
              <span *ngFor="let tag of hotel.amenities.split(',')" class="tag">{{ tag.trim() }}</span>
            </div>
          </div>

          <div class="room-list" *ngIf="hotel.roomCategories?.length">
            <h4>Available Room Types</h4>
            <div class="room-item" *ngFor="let room of hotel.roomCategories">
              <div class="room-info">
                <span class="room-type">{{ room.type }}</span>
                <span class="room-price">₹{{ room.pricePerNight }}/night</span>
              </div>
              <span class="room-avail" [class.no-rooms]="room.availableRooms <= 0">
                {{ room.availableRooms > 0 ? room.availableRooms + ' rooms available' : 'Fully Booked' }}
              </span>
            </div>
          </div>
        </div>

        <div class="booking-section">
          <h3>Book a Room</h3>
          <form [formGroup]="bookingForm" (ngSubmit)="onBook()">
            <div class="form-group">
              <label>Select Room Category</label>
              <select formControlName="roomCategoryId" class="form-control">
                <option [ngValue]="null" disabled selected>-- Choose a room --</option>
                <option
                  *ngFor="let room of hotel.roomCategories"
                  [ngValue]="room.id"
                  [disabled]="room.availableRooms <= 0">
                  {{ room.type }} — ₹{{ room.pricePerNight }}/night ({{ room.availableRooms }} left)
                </option>
              </select>
              <small class="error-text"
                *ngIf="bookingForm.get('roomCategoryId')?.invalid && bookingForm.get('roomCategoryId')?.touched">
                Please select a room category
              </small>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Check-in Date</label>
                <input type="date" formControlName="checkInDate" class="form-control" [min]="today">
                <small class="error-text"
                  *ngIf="bookingForm.get('checkInDate')?.invalid && bookingForm.get('checkInDate')?.touched">
                  Check-in date is required
                </small>
              </div>
              <div class="form-group">
                <label>Check-out Date</label>
                <input type="date" formControlName="checkOutDate" class="form-control" [min]="minCheckOut">
                <small class="error-text"
                  *ngIf="bookingForm.get('checkOutDate')?.invalid && bookingForm.get('checkOutDate')?.touched">
                  Check-out date is required
                </small>
              </div>
            </div>

            <div class="price-summary" *ngIf="totalPrice > 0">
              <div class="price-row">
                <span>{{ nightCount }} night(s) × ₹{{ selectedRoomPrice }}</span>
                <strong>₹{{ totalPrice }}</strong>
              </div>
            </div>

            <div class="error-msg" *ngIf="bookingError">⚠️ {{ bookingError }}</div>

            <button type="submit" [disabled]="bookingForm.invalid || isBooking" class="btn btn-primary btn-lg">
              {{ isBooking ? '⏳ Processing...' : '✔ Confirm Booking' }}
            </button>
          </form>
        </div>
      </div>
    </div>

    <div class="loading" *ngIf="!hotel">
      <p>⏳ Loading hotel details...</p>
    </div>
  `,
  styles: [`
    .details-container { padding: 2rem; max-width: 1000px; margin: 0 auto; }
    header { display: flex; align-items: center; gap: 2rem; margin-bottom: 2rem; }
    h1 { margin: 0; font-size: 1.8rem; color: #1a1a2e; }
    .hotel-info { display: grid; grid-template-columns: 1.5fr 1fr; gap: 3rem; }
    .description { line-height: 1.6; color: #444; margin: 1.5rem 0; }
    .amenities-box { margin-top: 1.5rem; }
    .amenities-box h4 { margin-bottom: 0.5rem; color: #333; }
    .amenity-tags { display: flex; flex-wrap: wrap; gap: 0.5rem; }
    .tag { background: #e3f2fd; color: #0d47a1; padding: 0.4rem 0.8rem; border-radius: 20px; font-size: 0.85rem; font-weight: 600; }
    .room-list { margin-top: 2rem; }
    .room-list h4 { margin-bottom: 0.75rem; color: #333; }
    .room-item { display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 1rem; background: #f9f9f9; border-radius: 8px; margin-bottom: 0.5rem; border: 1px solid #eee; }
    .room-info { display: flex; flex-direction: column; }
    .room-type { font-weight: 700; color: #333; }
    .room-price { font-size: 0.85rem; color: #007bff; margin-top: 0.2rem; }
    .room-avail { font-size: 0.85rem; color: #4caf50; font-weight: 600; }
    .no-rooms { color: #dc3545 !important; }
    .booking-section { background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); border: 1px solid #ddd; height: fit-content; position: sticky; top: 1rem; }
    .booking-section h3 { margin-top: 0; margin-bottom: 1.5rem; color: #1a1a2e; }
    .form-group { margin-bottom: 1.25rem; }
    label { display: block; font-weight: 600; margin-bottom: 0.5rem; color: #444; font-size: 0.9rem; }
    .form-control { width: 100%; padding: 0.75rem; border: 1.5px solid #ddd; border-radius: 6px; font-size: 0.95rem; box-sizing: border-box; transition: border-color 0.2s; background: #fafafa; }
    .form-control:focus { outline: none; border-color: #007bff; background: white; box-shadow: 0 0 0 3px rgba(0,123,255,0.1); }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .price-summary { background: linear-gradient(135deg, #f1f8e9, #e8f5e9); padding: 1rem 1.25rem; border-radius: 8px; margin-bottom: 1.25rem; border: 1.5px dashed #4caf50; }
    .price-row { display: flex; justify-content: space-between; align-items: center; }
    .price-row strong { color: #2e7d32; font-size: 1.2rem; }
    .btn-lg { width: 100%; padding: 1rem; font-size: 1rem; font-weight: bold; border: none; border-radius: 8px; cursor: pointer; background: linear-gradient(135deg, #007bff, #0056b3); color: white; transition: all 0.2s; letter-spacing: 0.5px; }
    .btn-lg:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,123,255,0.3); }
    .btn-lg:disabled { background: #ccc; cursor: not-allowed; transform: none; box-shadow: none; }
    .btn-secondary { padding: 0.5rem 1.25rem; background: #f0f0f0; border: 1px solid #ddd; border-radius: 6px; cursor: pointer; font-size: 0.9rem; }
    .btn-secondary:hover { background: #e0e0e0; }
    .error-text { color: #dc3545; font-size: 0.8rem; margin-top: 0.3rem; display: block; }
    .error-msg { background: #fff5f5; color: #c0392b; padding: 0.75rem 1rem; border-radius: 6px; margin-bottom: 1rem; border: 1px solid #f5c6cb; font-size: 0.9rem; }
    .loading { text-align: center; padding: 4rem; color: #777; font-size: 1.1rem; }
    @media (max-width: 768px) { .hotel-info { grid-template-columns: 1fr; } .form-row { grid-template-columns: 1fr; } }
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
  nightCount = 0;
  selectedRoomPrice = 0;
  bookingError = '';
  today = new Date().toISOString().split('T')[0];
  minCheckOut = this.today;

  bookingForm = this.fb.group({
    roomCategoryId: [null as number | null, Validators.required],
    checkInDate: ['', Validators.required],
    checkOutDate: ['', Validators.required]
  });

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.hotelService.getHotel(id).subscribe({
      next: (h: any) => this.hotel = h,
      error: () => {
        alert('Hotel not found!');
        this.router.navigate(['/user']);
      }
    });

    // Update min check-out date when check-in changes
    this.bookingForm.get('checkInDate')?.valueChanges.subscribe(date => {
      if (date) {
        this.minCheckOut = date;
        const checkOut = this.bookingForm.get('checkOutDate')?.value;
        if (checkOut && checkOut <= date) {
          this.bookingForm.patchValue({ checkOutDate: '' }, { emitEvent: false });
          this.totalPrice = 0;
          this.nightCount = 0;
        }
      }
    });

    this.bookingForm.valueChanges.subscribe(() => this.calculatePrice());
  }

  calculatePrice() {
    const { roomCategoryId, checkInDate, checkOutDate } = this.bookingForm.value;
    if (roomCategoryId && checkInDate && checkOutDate) {
      // roomCategoryId is already a number because we used [ngValue]="room.id"
      const room = this.hotel?.roomCategories.find(r => r.id === roomCategoryId);
      const start = new Date(checkInDate);
      const end = new Date(checkOutDate);
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24));

      if (room && days > 0) {
        this.nightCount = days;
        this.selectedRoomPrice = room.pricePerNight;
        this.totalPrice = room.pricePerNight * days;
      } else {
        this.totalPrice = 0;
        this.nightCount = 0;
        this.selectedRoomPrice = 0;
      }
    } else {
      this.totalPrice = 0;
      this.nightCount = 0;
    }
  }

  onBook() {
    this.bookingError = '';
    if (this.bookingForm.invalid) {
      this.bookingForm.markAllAsTouched();
      return;
    }

    if (this.hotel) {
      this.isBooking = true;
      const val = this.bookingForm.value;
      const request = {
        hotelId: this.hotel.id,
        roomCategoryId: val.roomCategoryId as number,
        checkInDate: val.checkInDate!,
        checkOutDate: val.checkOutDate!
      };

      this.bookingService.createBooking(request).subscribe({
        next: (res: any) => {
          this.router.navigate(['/user/confirmation'], { state: { booking: res } });
        },
        error: (err: any) => {
          this.isBooking = false;
          this.bookingError =
            err.error?.message ||
            err.error?.Message ||
            'Booking failed. Please try again.';
        }
      });
    }
  }
}
