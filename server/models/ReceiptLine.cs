namespace Split.Models;

public class ReceiptLine
{
    public ReceiptLine(int id, float price, int quantity)
    {
        Id = id;
        Price = price;
        Quantity = quantity;
    }

    public int Id { get; init; }

    public Item Item { get; init; }

    public float Price { get; init; }

    public int Quantity { get; init; }
}