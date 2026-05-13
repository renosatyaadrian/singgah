using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Singgah.API.DTOs;
using Singgah.API.Services;

namespace Singgah.API.Controllers;

[ApiController]
[Route("api")]
[Authorize]
public class ReviewsController(ReviewsService reviewsService) : ControllerBase
{
    private Guid UserId => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet("places/{placeId:guid}/reviews")]
    public async Task<IActionResult> GetReview(Guid placeId)
    {
        var review = await reviewsService.GetReviewAsync(UserId, placeId);
        return review is null ? NotFound() : Ok(review);
    }

    [HttpPost("places/{placeId:guid}/reviews")]
    public async Task<IActionResult> CreateReview(Guid placeId, [FromBody] CreateReviewRequest request)
    {
        if (request.Rating is < 1 or > 5)
            return BadRequest(new { message = "Rating must be between 1 and 5" });

        var (review, conflict) = await reviewsService.CreateReviewAsync(UserId, placeId, request);

        if (conflict) return Conflict(new { message = "Review already exists for this place" });
        if (review is null) return NotFound();

        return CreatedAtAction(nameof(GetReview), new { placeId }, review);
    }

    [HttpPut("reviews/{id:guid}")]
    public async Task<IActionResult> UpdateReview(Guid id, [FromBody] UpdateReviewRequest request)
    {
        if (request.Rating is < 1 or > 5)
            return BadRequest(new { message = "Rating must be between 1 and 5" });

        var review = await reviewsService.UpdateReviewAsync(UserId, id, request);
        return review is null ? NotFound() : Ok(review);
    }

    [HttpDelete("reviews/{id:guid}")]
    public async Task<IActionResult> DeleteReview(Guid id)
    {
        var deleted = await reviewsService.DeleteReviewAsync(UserId, id);
        return deleted ? NoContent() : NotFound();
    }
}
