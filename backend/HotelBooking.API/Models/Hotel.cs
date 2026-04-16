namespace HotelBooking.API.Models
{
    public class Hotel
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Amenities { get; set; } = string.Empty; // Comma separated or JSON

        public ICollection<RoomCategory> RoomCategories { get; set; } = new List<RoomCategory>();
        public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
    }
}
