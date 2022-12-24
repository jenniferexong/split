using System.ComponentModel.DataAnnotations;

namespace Split.Models.Requests.Store;

public class GetStoreByIdRequest
{
    public GetStoreByIdRequest(string name)
    {
        Name = name;
    }

    [Required]
    public string Name { get; set; }
}