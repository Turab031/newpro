import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Booking, BookingRequest } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5148/api/bookings';

  createBooking(request: BookingRequest) {
    // Ensure dates are in ISO format that .NET can parse correctly
    const payload = {
      ...request,
      checkInDate: new Date(request.checkInDate).toISOString(),
      checkOutDate: new Date(request.checkOutDate).toISOString()
    };
    return this.http.post<Booking>(this.apiUrl, payload);
  }

  getMyBookings() {
    return this.http.get<Booking[]>(`${this.apiUrl}/my-bookings`);
  }

  getAllBookings() {
    return this.http.get<Booking[]>(this.apiUrl);
  }
}
