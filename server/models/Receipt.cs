using System.ComponentModel.DataAnnotations;

namespace Split.Models;

public class Receipt
{
    public Receipt(int id, DateTime date)
    {
        Id = id;
        Date = date;
    }

    public int Id { get; init; }

    public int StoreId { get; init; }

    public Store Store { get; init; }

    public List<ReceiptLine> ReceiptLines { get; set; }

    [Required]
    public DateTime Date { get; init; }
}
