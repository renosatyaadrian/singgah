namespace Singgah.API.DTOs;

public record GoogleAuthRequest(string IdToken);

public record AuthResponse(
    string Token,
    UserDto User
);

public record UserDto(
    Guid Id,
    string Email,
    string Name,
    string? AvatarUrl
);
