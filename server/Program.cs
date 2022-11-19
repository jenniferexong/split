using Microsoft.EntityFrameworkCore;
using Split.Models;

const string CONNECTION_STRING = "Host=localhost;Database=postgres;Username=postgres;Password=password";

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<SplitDb>(opt => opt.UseNpgsql(CONNECTION_STRING));

var app = builder.Build();

app.MapGet("/", () => "Hello World!");
app.MapGet("/items", async (SplitDb db) => await db.Items.ToListAsync());
app.MapPost("/items", async (Item item, SplitDb db) =>
{
    db.Items.Add(item);
    await db.SaveChangesAsync();

    return Results.Created($"/items/{item.Id}", item);
});


app.Run();
