using HotelBooking.API.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace HotelBooking.API.Data
{
    public class HotelBookingContext : IdentityDbContext<User>
    {
        public HotelBookingContext(DbContextOptions<HotelBookingContext> options) : base(options)
        {
        }

        public DbSet<Hotel> Hotels { get; set; }
        public DbSet<RoomCategory> RoomCategories { get; set; }
        public DbSet<Booking> Bookings { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Configure relationships
            builder.Entity<Hotel>()
                .HasMany(h => h.RoomCategories)
                .WithOne(r => r.Hotel)
                .HasForeignKey(r => r.HotelId);

            builder.Entity<Hotel>()
                .HasMany(h => h.Bookings)
                .WithOne(b => b.Hotel)
                .HasForeignKey(b => b.HotelId);

            builder.Entity<Booking>()
                .HasOne(b => b.RoomCategory)
                .WithMany()
                .HasForeignKey(b => b.RoomCategoryId)
                .OnDelete(DeleteBehavior.NoAction);

            // Seed Data
            builder.Entity<Hotel>().HasData(
                new Hotel { Id = 1, Name = "Grand Plaza", Location = "Mumbai", Description = "Luxury at its best.", Amenities = "WiFi, AC, Pool, Gym" },
                new Hotel { Id = 2, Name = "Ocean View", Location = "Goa", Description = "Beach side resort.", Amenities = "WiFi, AC, Beach Access, Bar" }
            );

            builder.Entity<RoomCategory>().HasData(
                new RoomCategory { Id = 1, HotelId = 1, Type = "Deluxe", PricePerNight = 5000, TotalRooms = 10, AvailableRooms = 10 },
                new RoomCategory { Id = 2, HotelId = 1, Type = "Suite", PricePerNight = 8000, TotalRooms = 5, AvailableRooms = 5 },
                new RoomCategory { Id = 3, HotelId = 2, Type = "Standard", PricePerNight = 3000, TotalRooms = 20, AvailableRooms = 20 }
            );
        }
    }
}
