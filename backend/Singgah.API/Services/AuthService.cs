using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Google.Apis.Auth;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Singgah.API.Data;
using Singgah.API.DTOs;
using Singgah.API.Models;

namespace Singgah.API.Services;

public class AuthService(AppDbContext db, IConfiguration config)
{
    public async Task<AuthResponse> AuthenticateAsync(string idToken)
    {
        var payload = await ValidateGoogleTokenAsync(idToken);

        var user = await db.Users.FirstOrDefaultAsync(u => u.GoogleId == payload.Subject);
        if (user is null)
        {
            user = new User
            {
                GoogleId = payload.Subject,
                Email = payload.Email,
                Name = payload.Name,
                AvatarUrl = payload.Picture
            };
            db.Users.Add(user);
        }
        else
        {
            user.Name = payload.Name;
            user.AvatarUrl = payload.Picture;
            user.UpdatedAt = DateTime.UtcNow;
        }

        await db.SaveChangesAsync();

        var token = GenerateJwt(user);
        return new AuthResponse(token, new UserDto(user.Id, user.Email, user.Name, user.AvatarUrl));
    }

    private async Task<GoogleJsonWebSignature.Payload> ValidateGoogleTokenAsync(string idToken)
    {
        var settings = new GoogleJsonWebSignature.ValidationSettings
        {
            Audience = [config["Google:ClientId"]!]
        };
        return await GoogleJsonWebSignature.ValidateAsync(idToken, settings);
    }

    private string GenerateJwt(User user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["JWT:Secret"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var expiryHours = int.Parse(config["JWT:ExpiryHours"] ?? "24");

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Name, user.Name),
        };

        var token = new JwtSecurityToken(
            issuer: config["JWT:Issuer"],
            audience: config["JWT:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(expiryHours),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
