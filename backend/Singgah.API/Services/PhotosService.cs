using Amazon;
using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.EntityFrameworkCore;
using Singgah.API.Data;
using Singgah.API.DTOs;
using Singgah.API.Models;

namespace Singgah.API.Services;

public class PhotosService(AppDbContext db, IConfiguration config)
{
    private readonly string _bucketName = config["AWS:S3BucketName"]!;
    private readonly string _region = config["AWS:Region"]!;

    public async Task<(PresignedUrlResponse? response, string? error)> GetPresignedUrlAsync(
        Guid userId, Guid reviewId)
    {
        var review = await db.Reviews
            .Include(r => r.Photos)
            .FirstOrDefaultAsync(r => r.Id == reviewId && r.UserId == userId);

        if (review is null) return (null, "not_found");
        if (review.Photos.Any()) return (null, "max_photos");

        var s3Key = $"photos/{userId}/{reviewId}/{Guid.NewGuid()}.jpg";
        var expiry = DateTime.UtcNow.AddMinutes(10);

        using var s3Client = CreateS3Client();
        var request = new GetPreSignedUrlRequest
        {
            BucketName = _bucketName,
            Key = s3Key,
            Verb = HttpVerb.PUT,
            Expires = expiry,
            ContentType = "image/jpeg"
        };

        var url = await s3Client.GetPreSignedURLAsync(request);
        return (new PresignedUrlResponse(url, s3Key, expiry), null);
    }

    public async Task<(PhotoDto? photo, string? error)> ConfirmPhotoAsync(
        Guid userId, ConfirmPhotoRequest request)
    {
        var review = await db.Reviews
            .Include(r => r.Photos)
            .FirstOrDefaultAsync(r => r.Id == request.ReviewId && r.UserId == userId);

        if (review is null) return (null, "not_found");
        if (review.Photos.Any()) return (null, "max_photos");

        var photo = new Photo
        {
            ReviewId = request.ReviewId,
            S3Key = request.S3Key,
            S3Url = request.S3Url,
            OrderIndex = 0
        };

        db.Photos.Add(photo);
        await db.SaveChangesAsync();

        return (new PhotoDto(photo.Id, photo.S3Url, photo.OrderIndex), null);
    }

    public async Task<bool> DeletePhotoAsync(Guid userId, Guid photoId)
    {
        var photo = await db.Photos
            .Include(p => p.Review)
            .FirstOrDefaultAsync(p => p.Id == photoId && p.Review.UserId == userId);

        if (photo is null) return false;

        using var s3Client = CreateS3Client();
        await s3Client.DeleteObjectAsync(_bucketName, photo.S3Key);

        db.Photos.Remove(photo);
        await db.SaveChangesAsync();
        return true;
    }

    private AmazonS3Client CreateS3Client() =>
        new(RegionEndpoint.GetBySystemName(_region));
}
