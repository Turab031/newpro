import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HotelService } from '../../core/services/hotel.service';
import { Hotel } from '../../core/models/models';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="user-container">
      <header>
        <h1>Search Hotels</h1>
        <a routerLink="/user/history" class="btn btn-history">My Bookings</a>
      </header>

      <section class="filters">
        <form [formGroup]="searchForm" (ngSubmit)="onSearch()" class="filter-form">
          <input type="text" formControlName="location" placeholder="Location">
          <input type="number" formControlName="maxPrice" placeholder="Max Price">
          <input type="text" formControlName="roomType" placeholder="Room Type">
          <input type="text" formControlName="amenities" placeholder="Amenities">
          <button type="submit" class="btn btn-primary">Search</button>
          <button type="button" class="btn btn-secondary" (click)="resetSearch()">Reset</button>
        </form>
      </section>

      <section class="hotel-grid">
        <div *ngFor="let hotel of hotels" class="hotel-account">
          <div class="hotel-card">
            <h3>{{ hotel.name }}</h3>
            <p class="location"><strong>📍 {{ hotel.location }}</strong></p>
            <p class="description">{{ hotel.description }}</p>
            <p class="amenities">Features: {{ hotel.amenities }}</p>
            <div class="card-footer">
              <span class="price-from">Starting from {{ getMinPrice(hotel) | currency }}</span>
              <button class="btn btn-book" [routerLink]="['/user/details', hotel.id]">View Details</button>
            </div>
          </div>
        </div>
      </section>
      
      <div *ngIf="hotels.length === 0" class="no-results">
        <p>No hotels found matching your search criteria.</p>
      </div>
    </div>
  `,
  styles: [`
    .user-container { padding: 2rem; }
    header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
    .filter-form { display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 2rem; background: #f4f4f4; padding: 1.5rem; border-radius: 8px; }
    .filter-form input { padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px; }
    .hotel-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }
    .hotel-card { background: white; border-radius: 12px; padding: 1.5rem; box-shadow: 0 4px 12px rgba(0,0,0,0.08); border: 1px solid #eee; height: 100%; display: flex; flex-direction: column; }
    .location { color: #555; font-size: 0.9rem; }
    .description { color: #666; margin: 1rem 0; flex-grow: 1; }
    .amenities { color: #007bff; font-weight: bold; font-size: 0.85rem; }
    .card-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 1rem; border-top: 1px solid #eee; padding-top: 1rem; }
    .price-from { font-weight: bold; color: #333; }
    .btn { padding: 0.5rem 1rem; border: none; border-radius: 4px; cursor: pointer; text-decoration: none; }
    .btn-primary { background: #007bff; color: white; }
    .btn-secondary { background: #6c757d; color: white; }
    .btn-book { background: #ffc107; color: #000; font-weight: bold; }
    .btn-history { background: #6f42c1; color: white; }
    .no-results { text-align: center; margin-top: 3rem; color: #777; font-size: 1.2rem; }
  `]
})
export class UserDashboardComponent implements OnInit {
  private hotelService = inject(HotelService);
  private fb = inject(FormBuilder);

  hotels: Hotel[] = [];
  searchForm = this.fb.group({
    location: [''],
    maxPrice: [null],
    roomType: [''],
    amenities: ['']
  });

  ngOnInit() {
    this.loadHotels();
  }

  loadHotels() {
    this.hotelService.getHotels().subscribe((h: any) => this.hotels = h);
  }

  onSearch() {
    this.hotelService.searchHotels(this.searchForm.value).subscribe((h: any) => this.hotels = h);
  }

  resetSearch() {
    this.searchForm.reset();
    this.loadHotels();
  }

  getMinPrice(hotel: Hotel): number {
    if (!hotel.roomCategories || hotel.roomCategories.length === 0) return 0;
    return Math.min(...hotel.roomCategories.map((r: any) => r.pricePerNight));
  }
}
