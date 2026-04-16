namespace HotelBooking.API.DTOs
{
    public class RegisterDto
    {
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Role { get; set; } = "User"; // Admin or User
    }

    public class LoginDto
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class AuthResponseDto
    {
        public string Token { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
    }

    public class HotelDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Amenities { get; set; } = string.Empty;
        public List<RoomCategoryDto> RoomCategories { get; set; } = new();
    }

    public class RoomCategoryDto
    {
        public int Id { get; set; }
        public string Type { get; set; } = string.Empty;
        public decimal PricePerNight { get; set; }
        public int TotalRooms { get; set; }
        public int AvailableRooms { get; set; }
    }

    public class BookingRequestDto
    {
        public int HotelId { get; set; }
        public int RoomCategoryId { get; set; }
        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }
    }

    public class BookingResponseDto
    {
        public int Id { get; set; }
        public string BookingToken { get; set; } = string.Empty;
        public string HotelName { get; set; } = string.Empty;
        public string RoomType { get; set; } = string.Empty;
        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }
        public decimal TotalPrice { get; set; }
        public string Status { get; set; } = string.Empty;
    }
}
