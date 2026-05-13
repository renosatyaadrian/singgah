using Microsoft.EntityFrameworkCore;
using Singgah.API.Models;

namespace Singgah.API.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Place> Places => Set<Place>();
    public DbSet<Review> Reviews => Set<Review>();
    public DbSet<Photo> Photos => Set<Photo>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(e =>
        {
            e.HasKey(u => u.Id);
            e.HasIndex(u => u.GoogleId).IsUnique();
            e.HasIndex(u => u.Email).IsUnique();
            e.Property(u => u.GoogleId).IsRequired();
            e.Property(u => u.Email).IsRequired();
            e.Property(u => u.Name).IsRequired();
        });

        modelBuilder.Entity<Place>(e =>
        {
            e.HasKey(p => p.Id);
            e.Property(p => p.Category)
                .HasConversion<string>();
            e.HasOne(p => p.User)
                .WithMany(u => u.Places)
                .HasForeignKey(p => p.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Review>(e =>
        {
            e.HasKey(r => r.Id);
            e.HasIndex(r => new { r.PlaceId, r.UserId }).IsUnique();
            e.Property(r => r.Rating).IsRequired();
            e.HasOne(r => r.Place)
                .WithMany(p => p.Reviews)
                .HasForeignKey(r => r.PlaceId)
                .OnDelete(DeleteBehavior.Cascade);
            e.HasOne(r => r.User)
                .WithMany(u => u.Reviews)
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Photo>(e =>
        {
            e.HasKey(p => p.Id);
            e.HasOne(p => p.Review)
                .WithMany(r => r.Photos)
                .HasForeignKey(p => p.ReviewId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
