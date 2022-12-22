using Microsoft.EntityFrameworkCore;
using Split.Models;

const string CONNECTION_STRING = "Host=localhost;Database=postgres;Username=postgres;Password=password";

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<SplitDb>(opt => opt.UseNpgsql(CONNECTION_STRING));

var app = builder.Build();

app.MapGet("/", () => "Hello World!");

// Items
app.MapGet("/items", async (SplitDb db) => await db.Items.ToListAsync());
app.MapPost("/items", async (Item item, SplitDb db) =>
{
    db.Items.Add(item);
    await db.SaveChangesAsync();

    return Results.Created($"/items/{item.Id}", item);
});

// Stores
app.MapGet("/stores", async (SplitDb db) => await db.Stores.ToListAsync());
app.MapPost("/stores", async (Store store, SplitDb db) =>
{
    db.Stores.Add(store);
    await db.SaveChangesAsync();

    return Results.Created($"/stores/{store.Id}", store);
});

// Receipts
app.MapGet("/receipts", (SplitDb db) =>
{
    return Task.FromResult(Results.Ok(db.Receipts.Select(receipt => new
    {
        receipt.Id,
        Store = db.Stores.Find(receipt.StoreId),
        ReceiptLines = receipt.ReceiptLines,
    })));
});

app.MapPost("/receipts", async (Receipt receipt, SplitDb db) =>
{
    db.Receipts.Add(receipt);
    await db.SaveChangesAsync();

    return Results.Created($"/receipts/{receipt.Id}", receipt);
});

app.Run();
