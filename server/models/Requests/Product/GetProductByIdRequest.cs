using System.ComponentModel.DataAnnotations;

namespace Split.Models.Requests.Product;

public class GetProductByIdRequest
{
    public GetProductByIdRequest(string name)
    {
        Name = name;
    }

    [Required]
    public string Name { get; set; }
}