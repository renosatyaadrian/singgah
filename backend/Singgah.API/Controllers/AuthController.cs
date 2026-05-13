using Microsoft.AspNetCore.Mvc;
using Singgah.API.DTOs;
using Singgah.API.Services;

namespace Singgah.API.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController(AuthService authService) : ControllerBase
{
    [HttpPost("google")]
    public async Task<IActionResult> Google([FromBody] GoogleAuthRequest request)
    {
        try
        {
            var result = await authService.AuthenticateAsync(request.IdToken);
            Response.Cookies.Append("auth_token", result.Token, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTimeOffset.UtcNow.AddHours(24)
            });
            return Ok(result.User);
        }
        catch (Exception)
        {
            return Unauthorized(new { message = "Invalid Google token" });
        }
    }

    [HttpPost("logout")]
    public IActionResult Logout()
    {
        Response.Cookies.Delete("auth_token");
        return NoContent();
    }
}
