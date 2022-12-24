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

    public string GivenName { get; init; }

    public string FamilyName { get; init; }
}
