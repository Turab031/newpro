namespace HotelBooking.API.Models
{
    public class Booking
    {
        public int Id { get; set; }
        public string BookingToken { get; set; } = string.Empty; // HTL-XXXXXX
        
        public string UserId { get; set; } = string.Empty;
        public User? User { get; set; }

        public int HotelId { get; set; }
        public Hotel? Hotel { get; set; }

        public int RoomCategoryId { get; set; }
        public RoomCategory? RoomCategory { get; set; }

        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }
        public decimal TotalPrice { get; set; }
        public string Status { get; set; } = "Confirmed";
        public DateTime BookingDate { get; set; } = DateTime.UtcNow;
    }
}
