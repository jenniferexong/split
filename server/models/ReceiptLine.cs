using System.ComponentModel.DataAnnotations;

namespace Split.Models;

public class ReceiptLine
{
    public ReceiptLine(int id, float price)
    {
        Id = id;
        Price = price;
    }

    public int Id { get; init; } = 12;

    public int PersonId { get; init; }

    public Person Person { get; init; }

    public int ReceiptId { get; init; }

    public Receipt Receipt { get; init; }

    public int ItemId { get; init; }

    public Item Item { get; init; }

    [Required]
    public float Price { get; init; }
}