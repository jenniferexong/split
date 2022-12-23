using System.ComponentModel.DataAnnotations;

namespace Split.Models.Requests.Product;

public class AddProductRequest
{
    public AddProductRequest(string name)
    {
        Name = name;
    }

    [Required]
    public string Name { get; set; }
}