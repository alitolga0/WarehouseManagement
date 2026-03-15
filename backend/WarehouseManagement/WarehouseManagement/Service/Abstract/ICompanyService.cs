using System.Linq.Expressions;
using WarehouseManagement.Core.Utilities.Results;
using WarehouseManagement.Dtos.Company;
using WarehouseManagement.Models;
using IResult = WarehouseManagement.Core.Utilities.Results.IResult;

namespace WarehouseManagement.Service.Abstract
{
    public interface ICompanyService
    {
        Task<IDataResult<CompanyDto>> GetByIdAsync(Guid id);
        Task<IResult> AddAsync(CompanyCreateDto dto);
        Task<IResult> UpdateAsync(CompanyUpdateDto dto);
        Task<IResult> DeleteAsync(Guid id);

        Task<IDataResult<PagedResultDto<CompanyDto>>> GetPagedListAsync(
            int page,
            int pageSize,
            string? searchTerm = null);
    }

    public class PagedResultDto<T>
    {
        public List<T> Items { get; set; } = new();
        public int TotalCount { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
    }
}