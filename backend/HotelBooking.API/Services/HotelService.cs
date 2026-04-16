using HotelBooking.API.Data;
using HotelBooking.API.DTOs;
using HotelBooking.API.Models;
using Microsoft.EntityFrameworkCore;

namespace HotelBooking.API.Services
{
    public interface IHotelService
    {
        Task<IEnumerable<HotelDto>> GetAllHotels();
        Task<HotelDto?> GetHotelById(int id);
        Task<Hotel> CreateHotel(Hotel hotel);
        Task UpdateHotel(Hotel hotel);
        Task DeleteHotel(int id);
        Task<RoomCategory> AddRoomCategory(int hotelId, RoomCategory room);
        Task UpdateRoomCategory(RoomCategory room);
        Task DeleteRoomCategory(int id);
        Task<IEnumerable<HotelDto>> SearchHotels(string? location, decimal? maxPrice, string? roomType, string? amenities);
    }

    public class HotelService : IHotelService
    {
        private readonly HotelBookingContext _context;

        public HotelService(HotelBookingContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<HotelDto>> GetAllHotels()
        {
            var hotels = await _context.Hotels
                .Include(h => h.RoomCategories)
                .ToListAsync();

            return hotels.Select(MapToDto);
        }

        public async Task<HotelDto?> GetHotelById(int id)
        {
            var hotel = await _context.Hotels
                .Include(h => h.RoomCategories)
                .FirstOrDefaultAsync(h => h.Id == id);

            return hotel != null ? MapToDto(hotel) : null;
        }

        public async Task<Hotel> CreateHotel(Hotel hotel)
        {
            _context.Hotels.Add(hotel);
            await _context.SaveChangesAsync();
            return hotel;
        }

        public async Task UpdateHotel(Hotel hotel)
        {
            _context.Entry(hotel).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteHotel(int id)
        {
            var hotel = await _context.Hotels.FindAsync(id);
            if (hotel != null)
            {
                _context.Hotels.Remove(hotel);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<RoomCategory> AddRoomCategory(int hotelId, RoomCategory room)
        {
            room.HotelId = hotelId;
            room.AvailableRooms = room.TotalRooms; // Initialize available rooms
            _context.RoomCategories.Add(room);
            await _context.SaveChangesAsync();
            return room;
        }

        public async Task UpdateRoomCategory(RoomCategory room)
        {
            _context.Entry(room).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteRoomCategory(int id)
        {
            var room = await _context.RoomCategories.FindAsync(id);
            if (room != null)
            {
                _context.RoomCategories.Remove(room);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<HotelDto>> SearchHotels(string? location, decimal? maxPrice, string? roomType, string? amenities)
        {
            var query = _context.Hotels.Include(h => h.RoomCategories).AsQueryable();

            if (!string.IsNullOrEmpty(location))
                query = query.Where(h => h.Location.Contains(location));

            if (!string.IsNullOrEmpty(amenities))
                query = query.Where(h => h.Amenities.Contains(amenities));

            var hotels = await query.ToListAsync();

            var result = hotels.Select(MapToDto).ToList();

            if (maxPrice.HasValue)
                result = result.Where(h => h.RoomCategories.Any(r => r.PricePerNight <= maxPrice.Value)).ToList();

            if (!string.IsNullOrEmpty(roomType))
                result = result.Where(h => h.RoomCategories.Any(r => r.Type.Contains(roomType, StringComparison.OrdinalIgnoreCase))).ToList();

            return result;
        }

        private HotelDto MapToDto(Hotel hotel)
        {
            return new HotelDto
            {
                Id = hotel.Id,
                Name = hotel.Name,
                Location = hotel.Location,
                Description = hotel.Description,
                Amenities = hotel.Amenities,
                RoomCategories = hotel.RoomCategories.Select(r => new RoomCategoryDto
                {
                    Id = r.Id,
                    Type = r.Type,
                    PricePerNight = r.PricePerNight,
                    TotalRooms = r.TotalRooms,
                    AvailableRooms = r.AvailableRooms
                }).ToList()
            };
        }
    }
}
