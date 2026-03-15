using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using WarehouseManagement.Core.Repository;
using WarehouseManagement.Models;

namespace WarehouseManagement.Repository
{
    public class BaseRepository<TEntity> : IBaseRepository<TEntity>
        where TEntity : BaseEntity, new()
    {
        private readonly MainDbContext _context;
        private readonly DbSet<TEntity> _dbSet;

        public BaseRepository(MainDbContext context)
        {
            _context = context;
            _dbSet = _context.Set<TEntity>();
        }

        // IQueryable döndürüyoruz ki async metodları kullanabilelim
        public IQueryable<TEntity> GetAll(Expression<Func<TEntity, bool>> filter = null)
        {
            return filter == null
                ? _dbSet.AsQueryable()
                : _dbSet.Where(filter);
        }

        public async Task<TEntity> GetAsync(Expression<Func<TEntity, bool>> filter)
        {
            return await _dbSet.FirstOrDefaultAsync(filter);
        }

        public async Task AddAsync(TEntity entity)
        {
            entity.Id = Guid.NewGuid();
            entity.CreatedAt = DateTime.UtcNow;
            entity.UpdatedAt = DateTime.UtcNow;
            entity.IsDeleted = false;

            await _dbSet.AddAsync(entity);
        }

        public async Task UpdateAsync(TEntity entity)
        {
            var existingEntity = await _dbSet.FindAsync(entity.Id);
            if (existingEntity == null)
                throw new Exception("Entity not found");

            // Soft delete ve tarih alanlarını koru
            entity.CreatedAt = existingEntity.CreatedAt;
            entity.DeletedAt = existingEntity.DeletedAt;
            entity.IsDeleted = existingEntity.IsDeleted;
            entity.UpdatedAt = DateTime.UtcNow;

            _context.Entry(existingEntity).CurrentValues.SetValues(entity);
        }

        public async Task DeleteAsync(Guid id)
        {
            var entity = await _dbSet.FindAsync(id);
            if (entity == null)
                throw new Exception("Entity not found");

            entity.IsDeleted = true;
            entity.DeletedAt = DateTime.UtcNow;
            entity.UpdatedAt = DateTime.UtcNow;

            _dbSet.Update(entity);
        }

        // Navigation property dahil edilen versiyon
        public IQueryable<TEntity> GetAllWithNavigation(Expression<Func<TEntity, bool>> filter = null, params string[] navigations)
        {
            IQueryable<TEntity> query = _dbSet;
            foreach (var nav in navigations)
            {
                query = query.Include(nav);
            }

            return filter == null ? query : query.Where(filter);
        }

        public async Task<TEntity> GetWithNavigationAsync(Expression<Func<TEntity, bool>> filter, params string[] navigations)
        {
            IQueryable<TEntity> query = _dbSet;
            foreach (var nav in navigations)
            {
                query = query.Include(nav);
            }

            return await query.FirstOrDefaultAsync(filter);
        }
    }
}