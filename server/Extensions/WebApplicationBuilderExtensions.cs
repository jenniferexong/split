using Microsoft.AspNetCore.Mvc.ApplicationModels;

namespace Split.Extensions;

public static class WebApplicationBuilderExtensions
{
    public static void RegisterServices(this WebApplicationBuilder builder)
    {
        var _ = builder ?? throw new Exception("Web application builder is null");
        var connectionString = builder.Configuration.GetConnectionString("SplitDb");

        if (connectionString is null)
        {
            throw new Exception("Connection string is null");
        }

        builder.Services
            .AddSingleton<DbConnectionFactory>(new DbConnectionFactory(connectionString))
            .AddControllers(options =>
            {
                // Make controller routes kebab case
                options.Conventions.Add(new RouteTokenTransformerConvention(new KebabCaseTransformer()));
            });

        // Repositories
        builder.Services
            .AddSingleton<ProductsRepository>();
    }
}