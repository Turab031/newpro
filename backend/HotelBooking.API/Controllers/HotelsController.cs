using HotelBooking.API.DTOs;
using HotelBooking.API.Models;
using HotelBooking.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HotelBooking.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HotelsController : ControllerBase
    {
        private readonly IHotelService _hotelService;

        public HotelsController(IHotelService hotelService)
        {
            _hotelService = hotelService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _hotelService.GetAllHotels());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var hotel = await _hotelService.GetHotelById(id);
            if (hotel == null) return NotFound();
            return Ok(hotel);
        }

        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] string? location, [FromQuery] decimal? maxPrice, [FromQuery] string? roomType, [FromQuery] string? amenities)
        {
            return Ok(await _hotelService.SearchHotels(location, maxPrice, roomType, amenities));
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromBody] Hotel hotel)
        {
            var result = await _hotelService.CreateHotel(hotel);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, [FromBody] Hotel hotel)
        {
            if (id != hotel.Id) return BadRequest();
            await _hotelService.UpdateHotel(hotel);
            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            await _hotelService.DeleteHotel(id);
            return NoContent();
        }

        [HttpPost("{hotelId}/rooms")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AddRoom(int hotelId, [FromBody] RoomCategory room)
        {
            var result = await _hotelService.AddRoomCategory(hotelId, room);
            return Ok(result);
        }

        [HttpPut("rooms/{roomId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateRoom(int roomId, [FromBody] RoomCategory room)
        {
            if (roomId != room.Id) return BadRequest();
            await _hotelService.UpdateRoomCategory(room);
            return NoContent();
        }

        [HttpDelete("rooms/{roomId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteRoom(int roomId)
        {
            await _hotelService.DeleteRoomCategory(roomId);
            return NoContent();
        }
    }
}
