using WarehouseManagement.Core.Repository;

namespace WarehouseManagement.Repository
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly MainDbContext _dbContext;

        public UnitOfWork(MainDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public void SaveChanges()
        {
            _dbContext.SaveChanges();
        }

        public async Task SaveChangesAsync()
        {
            await _dbContext.SaveChangesAsync();
        }
    }
}
