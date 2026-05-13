using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Singgah.API.DTOs;
using Singgah.API.Models;
using Singgah.API.Services;

namespace Singgah.API.Controllers;

[ApiController]
[Route("api/places")]
[Authorize]
public class PlacesController(PlacesService placesService) : ControllerBase
{
    private Guid UserId => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet]
    public async Task<IActionResult> GetPlaces([FromQuery] PlaceCategory? category,
        [FromQuery] string? search, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var query = new PlacesQueryParams { Category = category, Search = search, Page = page, PageSize = pageSize };
        var result = await placesService.GetPlacesAsync(UserId, query);
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> CreatePlace([FromBody] CreatePlaceRequest request)
    {
        var place = await placesService.CreatePlaceAsync(UserId, request);
        return CreatedAtAction(nameof(GetPlace), new { id = place.Id }, place);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetPlace(Guid id)
    {
        var place = await placesService.GetPlaceAsync(UserId, id);
        return place is null ? NotFound() : Ok(place);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdatePlace(Guid id, [FromBody] UpdatePlaceRequest request)
    {
        var place = await placesService.UpdatePlaceAsync(UserId, id, request);
        return place is null ? NotFound() : Ok(place);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeletePlace(Guid id)
    {
        var deleted = await placesService.DeletePlaceAsync(UserId, id);
        return deleted ? NoContent() : NotFound();
    }
}
