using HotelBooking.API.Data;
using HotelBooking.API.DTOs;
using HotelBooking.API.Models;
using Microsoft.EntityFrameworkCore;

namespace HotelBooking.API.Services
{
    public interface IBookingService
    {
        Task<BookingResponseDto?> CreateBooking(string userId, BookingRequestDto request);
        Task<IEnumerable<BookingResponseDto>> GetUserBookings(string userId);
        Task<IEnumerable<BookingResponseDto>> GetAllBookings();
    }

    public class BookingService : IBookingService
    {
        private readonly HotelBookingContext _context;

        public BookingService(HotelBookingContext context)
        {
            _context = context;
        }

        public async Task<BookingResponseDto?> CreateBooking(string userId, BookingRequestDto request)
        {
            var room = await _context.RoomCategories
                .Include(r => r.Hotel)
                .FirstOrDefaultAsync(r => r.Id == request.RoomCategoryId && r.HotelId == request.HotelId);

            if (room == null || room.AvailableRooms <= 0)
            {
                return null;
            }

            // Simple availability check: reduce count
            room.AvailableRooms--;

            var booking = new Booking
            {
                BookingToken = GenerateToken(),
                UserId = userId,
                HotelId = request.HotelId,
                RoomCategoryId = request.RoomCategoryId,
                CheckInDate = request.CheckInDate,
                CheckOutDate = request.CheckOutDate,
                TotalPrice = room.PricePerNight * (decimal)(request.CheckOutDate - request.CheckInDate).TotalDays,
                BookingDate = DateTime.UtcNow,
                Status = "Confirmed"
            };

            _context.Bookings.Add(booking);
            await _context.SaveChangesAsync();

            return new BookingResponseDto
            {
                Id = booking.Id,
                BookingToken = booking.BookingToken,
                HotelName = room.Hotel!.Name,
                RoomType = room.Type,
                CheckInDate = booking.CheckInDate,
                CheckOutDate = booking.CheckOutDate,
                TotalPrice = booking.TotalPrice,
                Status = booking.Status
            };
        }

        public async Task<IEnumerable<BookingResponseDto>> GetUserBookings(string userId)
        {
            return await _context.Bookings
                .Where(b => b.UserId == userId)
                .Include(b => b.Hotel)
                .Include(b => b.RoomCategory)
                .Select(b => MapToDto(b))
                .ToListAsync();
        }

        public async Task<IEnumerable<BookingResponseDto>> GetAllBookings()
        {
            return await _context.Bookings
                .Include(b => b.Hotel)
                .Include(b => b.RoomCategory)
                .Select(b => MapToDto(b))
                .ToListAsync();
        }

        private string GenerateToken()
        {
            return "HTL-" + Guid.NewGuid().ToString().Substring(0, 8).ToUpper();
        }

        private static BookingResponseDto MapToDto(Booking b)
        {
            return new BookingResponseDto
            {
                Id = b.Id,
                BookingToken = b.BookingToken,
                HotelName = b.Hotel?.Name ?? "Unknown Hotel",
                RoomType = b.RoomCategory?.Type ?? "Unknown Room",
                CheckInDate = b.CheckInDate,
                CheckOutDate = b.CheckOutDate,
                TotalPrice = b.TotalPrice,
                Status = b.Status
            };
        }
    }
}
