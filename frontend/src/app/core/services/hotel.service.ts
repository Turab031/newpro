import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Hotel, RoomCategory } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class HotelService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5148/api/hotels';

  getHotels() {
    return this.http.get<Hotel[]>(this.apiUrl);
  }

  getHotel(id: number) {
    return this.http.get<Hotel>(`${this.apiUrl}/${id}`);
  }

  searchHotels(filters: any) {
    let params = new HttpParams();
    if (filters.location) params = params.set('location', filters.location);
    if (filters.maxPrice) params = params.set('maxPrice', filters.maxPrice.toString());
    if (filters.roomType) params = params.set('roomType', filters.roomType);
    if (filters.amenities) params = params.set('amenities', filters.amenities);

    return this.http.get<Hotel[]>(`${this.apiUrl}/search`, { params });
  }

  createHotel(hotel: any) {
    return this.http.post<Hotel>(this.apiUrl, hotel);
  }

  updateHotel(id: number, hotel: any) {
    return this.http.put(`${this.apiUrl}/${id}`, hotel);
  }

  deleteHotel(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  addRoom(hotelId: number, room: any) {
    return this.http.post<RoomCategory>(`${this.apiUrl}/${hotelId}/rooms`, room);
  }

  deleteRoom(roomId: number) {
    return this.http.delete(`${this.apiUrl}/rooms/${roomId}`);
  }
}
