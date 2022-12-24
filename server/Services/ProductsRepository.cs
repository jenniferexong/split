using System.Data;
using Dapper;
using Split.DbConnections;
using Split.Models;
using Split.Services.Interfaces;

namespace Split.Services;

public class ProductsRepository : IProductsRepository
{
    private readonly DbConnectionFactory _db;

    public ProductsRepository(DbConnectionFactory db)
    {
        _db = db;
    }

    public async Task<IEnumerable<Product>> GetAll()
    {
        const string QUERY = @"
            SELECT id, name
            FROM product
        ";

        using IDbConnection conn = await _db.ConnectAsync();

        var products = await conn.QueryAsync<Product>(QUERY);
        return products;
    }

    public async Task<Product> GetById(int id)
    {
        const string QUERY = @"
            SELECT * FROM product
            WHERE id=@id
        ";

        await using var conn = await _db.ConnectAsync();
        var product = await conn.QueryFirstOrDefaultAsync<Product>(QUERY, new { id });

        return product;
    }

    public async Task<Product> Add(string name)
    {
        const string QUERY = @"
            INSERT INTO product(name) values(@name)
            RETURNING id, name
        ";

        await using var conn = await _db.ConnectAsync();
        var product = await conn.QueryFirstOrDefaultAsync<Product>(QUERY, new { name });

        return product;
    }
}