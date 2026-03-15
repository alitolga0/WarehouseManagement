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
        public BaseRepository(MainDbContext context)
        {
            _context = context;
        }
        public async Task Add(TEntity entity)
        {
            entity.Id = Guid.NewGuid();
            entity.CreatedAt = DateTime.UtcNow;
            entity.UpdatedAt = DateTime.UtcNow;

            _context.Set<TEntity>().Add(entity);
        }

        public async Task Delete(Guid Id)
        {
            var entity = Get(x => x.Id == Id);
            if (entity == null)
            {
                throw new Exception("Verilen Id'ye göre entity bulunmadı!");
            }

            entity.IsDeleted = true;
            entity.DeletedAt = DateTime.UtcNow;
            _context.Set<TEntity>().Update(entity);
        }

        public TEntity Get(Expression<Func<TEntity, bool>> filter)
        {
            return _context.Set<TEntity>().FirstOrDefault(filter);
        }

        public TEntity GetWithNavigation(Expression<Func<TEntity, bool>> filter = null, params string[] navigations)
        {
            IQueryable<TEntity> query = _context.Set<TEntity>();

            foreach (var navigation in navigations)
            {
                query = query.Include(navigation);
            }

            return query.FirstOrDefault(filter);
        }

        public List<TEntity> GetAll(Expression<Func<TEntity, bool>> filter = null)
        {
            return filter == null
                ? _context.Set<TEntity>().ToList()
                : _context.Set<TEntity>().Where(filter).ToList();
        }

        public List<TEntity> GetAllWithNavigation(Expression<Func<TEntity, bool>> filter = null, params string[] navigations)
        {
            IQueryable<TEntity> query = _context.Set<TEntity>();

            foreach (var navigation in navigations)
            {
                query = query.Include(navigation);
            }

            return filter == null ? query.ToList() : query.Where(filter).ToList();
        }


        public async Task Update(TEntity entity)
        {
            var updatedEntity = _context.Set<TEntity>().Find(entity.Id);
            entity.UpdatedAt = DateTime.UtcNow;
            entity.CreatedAt = updatedEntity.CreatedAt;
            entity.IsDeleted = updatedEntity.IsDeleted;
            entity.DeletedAt = updatedEntity.DeletedAt;

            _context.Entry(updatedEntity).CurrentValues.SetValues(entity);
        }
    }
}
