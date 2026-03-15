using WarehouseManagement.Core.Utilities.Results;
using WarehouseManagement.Dtos.Product;
using IResult = WarehouseManagement.Core.Utilities.Results.IResult;

namespace WarehouseManagement.Service.Abstract
{
    public interface IProductService
    {
        Task<IDataResult<ProductDto>> GetByIdAsync(Guid id, Guid companyId);
        Task<IResult> AddAsync(ProductCreateDto dto);
        Task<IResult> UpdateAsync(ProductUpdateDto dto);
        Task<IResult> DeleteAsync(Guid id, Guid companyId);
        Task<IDataResult<PagedResultDto<ProductDto>>> GetPagedListAsync(
            Guid companyId,
            int page,
            int pageSize,
            string? searchTerm = null);
    }
}
