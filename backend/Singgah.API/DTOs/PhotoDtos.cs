namespace Singgah.API.DTOs;

public record PresignedUrlRequest(Guid ReviewId);

public record PresignedUrlResponse(
    string UploadUrl,
    string S3Key,
    DateTime ExpiresAt
);

public record ConfirmPhotoRequest(
    Guid ReviewId,
    string S3Key,
    string S3Url
);

public record PhotoDto(
    Guid Id,
    string S3Url,
    int OrderIndex
);
