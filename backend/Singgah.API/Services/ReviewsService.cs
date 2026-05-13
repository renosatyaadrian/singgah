using Microsoft.EntityFrameworkCore;
using Singgah.API.Data;
using Singgah.API.DTOs;
using Singgah.API.Models;

namespace Singgah.API.Services;

public class ReviewsService(AppDbContext db)
{
    public async Task<ReviewDto?> GetReviewAsync(Guid userId, Guid placeId)
    {
        var review = await db.Reviews
            .Include(r => r.Photos)
            .FirstOrDefaultAsync(r => r.PlaceId == placeId && r.UserId == userId);

        return review is null ? null : MapToDto(review);
    }

    public async Task<(ReviewDto? review, bool conflict)> CreateReviewAsync(
        Guid userId, Guid placeId, CreateReviewRequest request)
    {
        var placeExists = await db.Places.AnyAsync(p => p.Id == placeId && p.UserId == userId);
        if (!placeExists) return (null, false);

        var exists = await db.Reviews.AnyAsync(r => r.PlaceId == placeId && r.UserId == userId);
        if (exists) return (null, true);

        var review = new Review
        {
            PlaceId = placeId,
            UserId = userId,
            Rating = request.Rating,
            Description = request.Description,
            VisitedAt = request.VisitedAt
        };

        db.Reviews.Add(review);
        await db.SaveChangesAsync();

        await db.Entry(review).Collection(r => r.Photos).LoadAsync();
        return (MapToDto(review), false);
    }

    public async Task<ReviewDto?> UpdateReviewAsync(Guid userId, Guid reviewId, UpdateReviewRequest request)
    {
        var review = await db.Reviews
            .Include(r => r.Photos)
            .FirstOrDefaultAsync(r => r.Id == reviewId && r.UserId == userId);

        if (review is null) return null;

        review.Rating = request.Rating;
        review.Description = request.Description;
        review.VisitedAt = request.VisitedAt;
        review.UpdatedAt = DateTime.UtcNow;

        await db.SaveChangesAsync();
        return MapToDto(review);
    }

    public async Task<bool> DeleteReviewAsync(Guid userId, Guid reviewId)
    {
        var review = await db.Reviews.FirstOrDefaultAsync(r => r.Id == reviewId && r.UserId == userId);
        if (review is null) return false;

        db.Reviews.Remove(review);
        await db.SaveChangesAsync();
        return true;
    }

    private static ReviewDto MapToDto(Review review)
    {
        var photo = review.Photos.OrderBy(p => p.OrderIndex).FirstOrDefault();
        return new ReviewDto(
            review.Id,
            review.PlaceId,
            review.Rating,
            review.Description,
            review.VisitedAt,
            review.CreatedAt,
            review.UpdatedAt,
            photo is null ? null : new PhotoDto(photo.Id, photo.S3Url, photo.OrderIndex)
        );
    }
}
