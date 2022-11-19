using Microsoft.EntityFrameworkCore;

namespace Split.Models;

[Index(nameof(Name), IsUnique = true)]
public class Store
{
    public Store(int id, string name)
    {
        Id = id;
        Name = name;
    }

    public int Id { get; init; }

    public string Name { get; init; }
}