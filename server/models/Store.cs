using System.ComponentModel.DataAnnotations;
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

    [Required]
    [MaxLength(100)]
    public string Name { get; init; }
}