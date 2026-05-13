namespace Singgah.API.Models;

public class Review
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid PlaceId { get; set; }
    public Guid UserId { get; set; }
    public int Rating { get; set; }
    public string Description { get; set; } = string.Empty;
    public DateOnly? VisitedAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public Place Place { get; set; } = null!;
    public User User { get; set; } = null!;
    public ICollection<Photo> Photos { get; set; } = [];
}
