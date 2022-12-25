using Split.Models;

namespace Split.Services.Interfaces;

public interface IPeopleRepository
{
    Task<IEnumerable<Person>> GetAll();

    Task<Person?> GetById(int id);

    Task<Person> Add(string firstName, string lastName, string email);
}