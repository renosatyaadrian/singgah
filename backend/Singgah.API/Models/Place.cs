namespace Singgah.API.Models;

public enum PlaceCategory
{
    Food,
    TouristSpot,
    Hotel
}

public class Place
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public string Name { get; set; } = string.Empty;
    public PlaceCategory Category { get; set; }
    public string GmapsUrl { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public User User { get; set; } = null!;
    public ICollection<Review> Reviews { get; set; } = [];
}
