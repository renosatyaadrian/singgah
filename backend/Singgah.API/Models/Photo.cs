namespace Singgah.API.Models;

public class Photo
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ReviewId { get; set; }
    public string S3Key { get; set; } = string.Empty;
    public string S3Url { get; set; } = string.Empty;
    public int OrderIndex { get; set; } = 0;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Review Review { get; set; } = null!;
}
