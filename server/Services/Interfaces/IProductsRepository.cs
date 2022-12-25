using Split.Models;

namespace Split.Services.Interfaces;

public interface IProductsRepository
{
    Task<IEnumerable<Product>> GetAll();

    Task<Product?> GetById(int id);

    Task<Product> Add(string name);
}