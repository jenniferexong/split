using System.ComponentModel.DataAnnotations;

namespace Split.Models.Requests.Store;

public class AddStoreRequest
{
    public AddStoreRequest(string name)
    {
        Name = name;
    }

    [Required]
    public string Name { get; set; }
}