using WarehouseManagement.Core.Utilities.Results;
using WarehouseManagement.Dtos.WareHouse;
using IResult = WarehouseManagement.Core.Utilities.Results.IResult;

namespace WarehouseManagement.Service.Abstract
{
    public interface IWarehouseService
    {
        Task<IDataResult<WarehouseDto>> GetByIdAsync(Guid id, Guid companyId);

        Task<IResult> AddAsync(WarehouseCreateDto dto);

        Task<IResult> UpdateAsync(WarehouseUpdateDto dto);

        Task<IResult> DeleteAsync(Guid id, Guid companyId);

        Task<IDataResult<PagedResultDto<WarehouseDto>>> GetPagedListAsync(
            Guid companyId,
            int page,
            int pageSize,
            string? searchTerm = null);
    }
}