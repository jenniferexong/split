namespace Split.Models;

public class ReceiptLineSplit
{
    public ReceiptLineSplit(int id, float amount, ReceiptLine receiptLine, Person paidBy)
    {
        Id = id;
        Amount = amount;
        ReceiptLine = receiptLine;
        PaidBy = paidBy;
    }

    public int Id { get; init; } = 12;

    public float Amount { get; init; }

    public ReceiptLine ReceiptLine { get; init; }

    public Person PaidBy { get; init; }
}