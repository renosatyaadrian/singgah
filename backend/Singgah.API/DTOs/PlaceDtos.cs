using Singgah.API.Models;

namespace Singgah.API.DTOs;

public record CreatePlaceRequest(
    string Name,
    PlaceCategory Category,
    string GmapsUrl
);

public record UpdatePlaceRequest(
    string Name,
    PlaceCategory Category,
    string GmapsUrl
);

public record PlaceDto(
    Guid Id,
    string Name,
    PlaceCategory Category,
    string GmapsUrl,
    DateTime CreatedAt,
    DateTime UpdatedAt,
    ReviewSummaryDto? Review
);

public record ReviewSummaryDto(
    Guid Id,
    int Rating,
    string Description,
    DateOnly? VisitedAt,
    PhotoDto? Photo
);

public record PlacesQueryParams
{
    public PlaceCategory? Category { get; init; }
    public string? Search { get; init; }
    public int Page { get; init; } = 1;
    public int PageSize { get; init; } = 20;
}

public record PagedResult<T>(
    IEnumerable<T> Items,
    int TotalCount,
    int Page,
    int PageSize
);
