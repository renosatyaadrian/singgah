using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Singgah.API.DTOs;
using Singgah.API.Services;

namespace Singgah.API.Controllers;

[ApiController]
[Route("api/photos")]
[Authorize]
public class PhotosController(PhotosService photosService) : ControllerBase
{
    private Guid UserId => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpPost("presigned-url")]
    public async Task<IActionResult> GetPresignedUrl([FromBody] PresignedUrlRequest request)
    {
        var (response, error) = await photosService.GetPresignedUrlAsync(UserId, request.ReviewId);

        return error switch
        {
            "not_found" => NotFound(),
            "max_photos" => BadRequest(new { message = "Maximum 1 photo per review" }),
            _ => Ok(response)
        };
    }

    [HttpPost("confirm")]
    public async Task<IActionResult> ConfirmPhoto([FromBody] ConfirmPhotoRequest request)
    {
        var (photo, error) = await photosService.ConfirmPhotoAsync(UserId, request);

        return error switch
        {
            "not_found" => NotFound(),
            "max_photos" => BadRequest(new { message = "Maximum 1 photo per review" }),
            _ => Ok(photo)
        };
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeletePhoto(Guid id)
    {
        var deleted = await photosService.DeletePhotoAsync(UserId, id);
        return deleted ? NoContent() : NotFound();
    }
}
