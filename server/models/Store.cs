using System.ComponentModel.DataAnnotations;

namespace Split.Models;

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