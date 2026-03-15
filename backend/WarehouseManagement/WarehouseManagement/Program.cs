using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using WarehouseManagement.Core.Repository;
using WarehouseManagement.Repository;
using WarehouseManagement.Service.Abstract;
using WarehouseManagement.Service.Concrete;

var builder = WebApplication.CreateBuilder(args);

// addscope
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped(typeof(IBaseRepository<>), typeof(BaseRepository<>));
builder.Services.AddScoped<ICompanyService, CompanyService>();
builder.Services.AddScoped<IWarehouseService, WarehouseService>();



//dbcontext
builder.Services.AddDbContext<MainDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));


builder.Services.AddControllers();

// Swagger config
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Warehouse API", Version = "v1" });
});

var app = builder.Build();


if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Warehouse API v1");
        c.RoutePrefix = string.Empty; 
    });
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();