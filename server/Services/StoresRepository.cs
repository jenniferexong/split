using Dapper;
using Split.DbConnections;
using Split.Models;
using Split.Services.Interfaces;

namespace Split.Services;

public class StoresRepository : IStoresRepository
{
    private readonly DbConnectionFactory _db;

    public StoresRepository(DbConnectionFactory db)
    {
        _db = db;
    }

    public async Task<IEnumerable<Store>> GetAll()
    {
        const string QUERY = @"
            SELECT id, name
            FROM store
        ";

        await using var conn = await _db.ConnectAsync();

        var stores = await conn.QueryAsync<Store>(QUERY);
        return stores;
    }

    public async Task<Store?> GetById(int id)
    {
        const string QUERY = @"
            SELECT id, name
            FROM store
            WHERE id=@id
        ";

        await using var conn = await _db.ConnectAsync();
        var store = await conn.QueryFirstOrDefaultAsync<Store?>(QUERY, new { id });

        return store;
    }

    public async Task<Store> Add(string name)
    {
        const string QUERY = @"
            INSERT INTO store(name) 
            VALUES (@name)
            RETURNING id, name
        ";

        await using var conn = await _db.ConnectAsync();
        var store = await conn.QueryFirstOrDefaultAsync<Store>(QUERY, new { name });

        return store;
    }
}