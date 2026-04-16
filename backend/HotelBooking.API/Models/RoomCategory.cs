namespace HotelBooking.API.Models
{
    public class RoomCategory
    {
        public int Id { get; set; }
        public string Type { get; set; } = string.Empty; // Single, Double, Deluxe
        public decimal PricePerNight { get; set; }
        public int TotalRooms { get; set; }
        public int AvailableRooms { get; set; }

        public int HotelId { get; set; }
        public Hotel? Hotel { get; set; }
    }
}
