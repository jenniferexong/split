using Split.Models;

namespace Split.Services.Interfaces;

public interface IStoresRepository
{
    Task<IEnumerable<Store>> GetAll();

    Task<Store?> GetById(int id);

    Task<Store> Add(string name);
}