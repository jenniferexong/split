using Dapper;
using Split.DbConnections;
using Split.Models;
using Split.Services.Interfaces;

namespace Split.Services;

public class PeopleRepository : IPeopleRepository
{
    private readonly DbConnectionFactory _db;

    public PeopleRepository(DbConnectionFactory db)
    {
        _db = db;
    }

    public async Task<IEnumerable<Person>> GetAll()
    {
        const string QUERY = @"
            SELECT id, first_name, last_name, email
            FROM person
        ";

        await using var conn = await _db.ConnectAsync();

        var persons = await conn.QueryAsync<Person>(QUERY);
        return persons;
    }

    public async Task<Person?> GetById(int id)
    {
        const string QUERY = @"
            SELECT id, first_name, last_name, email
            FROM person
            WHERE id=@id
        ";

        await using var conn = await _db.ConnectAsync();
        var person = await conn.QueryFirstOrDefaultAsync<Person?>(QUERY, new { id });

        return person;
    }

    public async Task<Person> Add(string firstName, string lastName, string email)
    {
        const string QUERY = @"
            INSERT INTO person(first_name, last_name, email)
            VALUES (@firstName, @lastName, @email)
            RETURNING id, first_name, last_name, email
        ";

        await using var conn = await _db.ConnectAsync();
        var person = await conn.QueryFirstOrDefaultAsync<Person>(QUERY, new { firstName, lastName, email });

        return person;
    }
}