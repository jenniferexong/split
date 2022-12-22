using Microsoft.EntityFrameworkCore;

namespace Split.Models;

class SplitDb : DbContext
{
    public SplitDb(DbContextOptions<SplitDb> options) : base(options) { }

    public DbSet<Item> Items => Set<Item>();

    public DbSet<Receipt> Receipts => Set<Receipt>();

    public DbSet<ReceiptLine> ReceiptLines => Set<ReceiptLine>();

    public DbSet<Store> Stores => Set<Store>();

    public DbSet<Person> People => Set<Person>();
}
