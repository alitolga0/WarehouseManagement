using System.Linq.Expressions;
using WarehouseManagement.Models;

namespace WarehouseManagement.Core.Repository
{
    public interface IBaseRepository<T> where T : BaseEntity, new()
    {
        List<T> GetAll(Expression<Func<T, bool>> filter = null);
        T Get(Expression<Func<T, bool>> filter);
        Task Add(T entity);
        Task Update(T entity);
        Task Delete(Guid id);
    }
}
