using Microsoft.AspNetCore.Identity;

namespace HotelBooking.API.Models
{
    public class User : IdentityUser
    {
        public string FullName { get; set; } = string.Empty;
    }
}
