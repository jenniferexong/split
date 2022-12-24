using Npgsql;

namespace Split.DbConnections;

public class DbConnectionFactory
{
    private readonly NpgsqlDataSource _src;

    public DbConnectionFactory(string connectionString)
    {
        _src = NpgsqlDataSource.Create(connectionString);
    }

    public async Task<NpgsqlConnection> ConnectAsync(CancellationToken cancellationToken = default)
    {
        return await _src.OpenConnectionAsync(cancellationToken);
    }
}
