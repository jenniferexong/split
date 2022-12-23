using System.Data;
using Dapper;
using Split;
using Split.Models;

public class ProductsRepository
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

        using IDbConnection db = _db.Connect();
        return await db.QueryAsync<Product>(QUERY);
    }

    public async Task<Product> GetById(int id)
    {
        const string QUERY = @"
            SELECT * FROM product
            WHERE id=@id
        ";

        using IDbConnection db = _db.Connect();
        return await db.QueryFirstOrDefaultAsync<Product>(QUERY, new { id });
    }

    public async Task<Product> Add(string name)
    {
        const string QUERY = @"
            INSERT INTO product(name) values(@name)
            RETURNING id, name
        ";

        using IDbConnection db = _db.Connect();
        var product = await db.QueryFirstOrDefaultAsync<Product>(QUERY, new { name });
        return product;
    }
}