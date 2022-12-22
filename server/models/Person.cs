using System.ComponentModel.DataAnnotations;

namespace Split.Models;

public class Person
{
    public Person(int id, string givenName, string familyName)
    {
        Id = id;
        GivenName = givenName;
        FamilyName = familyName;
    }

    public int Id { get; init; }

    [Required]
    [MaxLength(100)]
    public string GivenName { get; init; }

    [MaxLength(100)]
    public string FamilyName { get; init; }
}
