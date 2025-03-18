using Microsoft.EntityFrameworkCore;
using PersonAccountApp.Models;

namespace PersonAccountApp.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Person> Persons { get; set; }
        public DbSet<Account> Accounts { get; set; }
        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<Status> Statuses { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure unique indexes
            modelBuilder.Entity<Person>()
                .HasIndex(p => p.IdNumber)
                .IsUnique();

            modelBuilder.Entity<Account>()
                .HasIndex(a => a.AccountNumber)
                .IsUnique();

            // Configure relationships
            modelBuilder.Entity<Account>()
                .HasOne(a => a.Person)
                .WithMany(p => p.Accounts)
                .HasForeignKey(a => a.PersonCode)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Account>()
                .HasOne(a => a.Status)
                .WithMany(s => s.Accounts)
                .HasForeignKey(a => a.StatusCode)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Transaction>()
                .HasOne(t => t.Account)
                .WithMany(a => a.Transactions)
                .HasForeignKey(t => t.AccountCode)
                .OnDelete(DeleteBehavior.Restrict);

            // Seed Status data
            modelBuilder.Entity<Status>().HasData(
                new Status { Code = 1, Name = "Open" },
                new Status { Code = 2, Name = "Closed" }
            );
        }
    }
} 