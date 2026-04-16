export interface User {
    token: string;
    fullName: string;
    role: string;
}

export interface Hotel {
    id: number;
    name: string;
    location: string;
    description: string;
    amenities: string;
    roomCategories: RoomCategory[];
}

export interface RoomCategory {
    id: number;
    type: string;
    pricePerNight: number;
    totalRooms: number;
    availableRooms: number;
}

export interface Booking {
    id: number;
    bookingToken: string;
    hotelName: string;
    roomType: string;
    checkInDate: string;
    checkOutDate: string;
    totalPrice: number;
    status: string;
}

export interface BookingRequest {
    hotelId: number;
    roomCategoryId: number;
    checkInDate: string;
    checkOutDate: string;
}
