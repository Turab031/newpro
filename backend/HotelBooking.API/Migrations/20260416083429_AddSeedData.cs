using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace HotelBooking.API.Migrations
{
    /// <inheritdoc />
    public partial class AddSeedData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Hotels",
                columns: new[] { "Id", "Amenities", "Description", "Location", "Name" },
                values: new object[,]
                {
                    { 1, "WiFi, AC, Pool, Gym", "Luxury at its best.", "Mumbai", "Grand Plaza" },
                    { 2, "WiFi, AC, Beach Access, Bar", "Beach side resort.", "Goa", "Ocean View" }
                });

            migrationBuilder.InsertData(
                table: "RoomCategories",
                columns: new[] { "Id", "AvailableRooms", "HotelId", "PricePerNight", "TotalRooms", "Type" },
                values: new object[,]
                {
                    { 1, 10, 1, 5000m, 10, "Deluxe" },
                    { 2, 5, 1, 8000m, 5, "Suite" },
                    { 3, 20, 2, 3000m, 20, "Standard" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "RoomCategories",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "RoomCategories",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "RoomCategories",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Hotels",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Hotels",
                keyColumn: "Id",
                keyValue: 2);
        }
    }
}
