using Microsoft.EntityFrameworkCore;
using Singgah.API.Data;
using Singgah.API.DTOs;
using Singgah.API.Models;

namespace Singgah.API.Services;

public class PlacesService(AppDbContext db)
{
    public async Task<PagedResult<PlaceDto>> GetPlacesAsync(Guid userId, PlacesQueryParams query)
    {
        var q = db.Places
            .Include(p => p.Reviews)
                .ThenInclude(r => r.Photos)
            .Where(p => p.UserId == userId)
            .AsQueryable();

        if (query.Category.HasValue)
            q = q.Where(p => p.Category == query.Category.Value);

        if (!string.IsNullOrWhiteSpace(query.Search))
            q = q.Where(p => EF.Functions.ILike(p.Name, $"%{query.Search}%"));

        var totalCount = await q.CountAsync();

        var items = await q
            .OrderByDescending(p => p.UpdatedAt)
            .Skip((query.Page - 1) * query.PageSize)
            .Take(query.PageSize)
            .ToListAsync();

        return new PagedResult<PlaceDto>(items.Select(MapToDto), totalCount, query.Page, query.PageSize);
    }

    public async Task<PlaceDto?> GetPlaceAsync(Guid userId, Guid placeId)
    {
        var place = await db.Places
            .Include(p => p.Reviews)
                .ThenInclude(r => r.Photos)
            .FirstOrDefaultAsync(p => p.Id == placeId && p.UserId == userId);

        return place is null ? null : MapToDto(place);
    }

    public async Task<PlaceDto> CreatePlaceAsync(Guid userId, CreatePlaceRequest request)
    {
        var place = new Place
        {
            UserId = userId,
            Name = request.Name,
            Category = request.Category,
            GmapsUrl = request.GmapsUrl
        };

        db.Places.Add(place);
        await db.SaveChangesAsync();
        return MapToDto(place);
    }

    public async Task<PlaceDto?> UpdatePlaceAsync(Guid userId, Guid placeId, UpdatePlaceRequest request)
    {
        var place = await db.Places
            .Include(p => p.Reviews).ThenInclude(r => r.Photos)
            .FirstOrDefaultAsync(p => p.Id == placeId && p.UserId == userId);

        if (place is null) return null;

        place.Name = request.Name;
        place.Category = request.Category;
        place.GmapsUrl = request.GmapsUrl;
        place.UpdatedAt = DateTime.UtcNow;

        await db.SaveChangesAsync();
        return MapToDto(place);
    }

    public async Task<bool> DeletePlaceAsync(Guid userId, Guid placeId)
    {
        var place = await db.Places.FirstOrDefaultAsync(p => p.Id == placeId && p.UserId == userId);
        if (place is null) return false;

        db.Places.Remove(place);
        await db.SaveChangesAsync();
        return true;
    }

    private static PlaceDto MapToDto(Place place)
    {
        var review = place.Reviews.FirstOrDefault();
        ReviewSummaryDto? reviewSummary = null;

        if (review is not null)
        {
            var photo = review.Photos.OrderBy(p => p.OrderIndex).FirstOrDefault();
            reviewSummary = new ReviewSummaryDto(
                review.Id,
                review.Rating,
                review.Description,
                review.VisitedAt,
                photo is null ? null : new PhotoDto(photo.Id, photo.S3Url, photo.OrderIndex)
            );
        }

        return new PlaceDto(
            place.Id,
            place.Name,
            place.Category,
            place.GmapsUrl,
            place.CreatedAt,
            place.UpdatedAt,
            reviewSummary
        );
    }
}
