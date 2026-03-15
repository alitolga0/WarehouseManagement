using System.Linq.Expressions;
using WarehouseManagement.Models;

namespace WarehouseManagement.Core.Repository
{
    public interface IBaseRepository<T> where T : BaseEntity, new()
    {
        IQueryable<T> GetAll(Expression<Func<T, bool>> filter = null);
        Task<T> GetAsync(Expression<Func<T, bool>> filter);
        Task AddAsync(T entity);
        Task UpdateAsync(T entity);
        Task DeleteAsync(Guid id);
    }
}
