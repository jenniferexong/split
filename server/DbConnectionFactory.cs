using System.Data;
using Npgsql;

namespace Split;

public class DbConnectionFactory
{
    private readonly string _connectionString;

    public DbConnectionFactory(string connectionString)
    {
        _connectionString = connectionString;
    }

    public IDbConnection Connect()
    {
        return new NpgsqlConnection(_connectionString);
    }
}
