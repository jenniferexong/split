namespace Split.Models;

public class ReceiptLine
{
    public ReceiptLine(int id, float price, Receipt receipt, Product product, IEnumerable<ReceiptLineSplit> splits)
    {
        Id = id;
        Price = price;
        Receipt = receipt;
        Product = product;
        Splits = splits;
    }

    public int Id { get; init; }

    public float Price { get; init; }

    public Receipt Receipt { get; init; }

    public Product Product { get; init; }

    public IEnumerable<ReceiptLineSplit> Splits { get; init; }
}