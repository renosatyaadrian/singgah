namespace Singgah.API.DTOs;

public record CreateReviewRequest(
    int Rating,
    string Description,
    DateOnly? VisitedAt
);

public record UpdateReviewRequest(
    int Rating,
    string Description,
    DateOnly? VisitedAt
);

public record ReviewDto(
    Guid Id,
    Guid PlaceId,
    int Rating,
    string Description,
    DateOnly? VisitedAt,
    DateTime CreatedAt,
    DateTime UpdatedAt,
    PhotoDto? Photo
);
