using WarehouseManagement.Models;
using WarehouseManagement.Service.Abstract;
using WarehouseManagement.Core.Utilities.Results;
using WarehouseManagement.Core.Repository;
using WarehouseManagement.Dtos.WareHouse;
using Microsoft.EntityFrameworkCore;
using IResult = WarehouseManagement.Core.Utilities.Results.IResult;

namespace WarehouseManagement.Service.Concrete
{
    public class WarehouseService : IWarehouseService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IBaseRepository<Warehouse> _baseRepository;

        public WarehouseService(IUnitOfWork unitOfWork, IBaseRepository<Warehouse> baseRepository)
        {
            _unitOfWork = unitOfWork;
            _baseRepository = baseRepository;
        }

        public async Task<IResult> AddAsync(WarehouseCreateDto dto)
        {
            var warehouse = new Warehouse
            {
                Name = dto.Name,
                CompanyId = dto.CompanyId
            };

            await _baseRepository.AddAsync(warehouse); 
            await _unitOfWork.SaveChangesAsync();

            return new SuccessResult("Warehouse added successfully.");
        }

        public async Task<IResult> UpdateAsync(WarehouseUpdateDto dto)
        {

            var warehouse = await _baseRepository.GetAsync(x =>
                x.Id == dto.Id &&
                x.CompanyId == dto.CompanyId &&
                x.IsDeleted != true); 

            if (warehouse == null)
                return new ErrorResult("Warehouse not found.");

            warehouse.Name = dto.Name;

            await _baseRepository.UpdateAsync(warehouse);
            await _unitOfWork.SaveChangesAsync();

            return new SuccessResult("Warehouse updated successfully.");
        }

        public async Task<IResult> DeleteAsync(Guid id, Guid companyId)
        {
         
            var warehouse = await _baseRepository.GetAsync(x =>
                x.Id == id &&
                x.CompanyId == companyId &&
                x.IsDeleted != true);

            if (warehouse == null)
                return new ErrorResult("Warehouse not found.");

            await _baseRepository.DeleteAsync(id);
            await _unitOfWork.SaveChangesAsync();

            return new SuccessResult("Warehouse deleted successfully.");
        }

        public async Task<IDataResult<WarehouseDto>> GetByIdAsync(Guid id, Guid companyId)
        {
            var warehouse = await _baseRepository.GetAsync(x =>
            x.Id == id &&
            x.CompanyId == companyId &&
            x.IsDeleted != true);

            if (warehouse == null)
                return new ErrorDataResult<WarehouseDto>(null!, "Warehouse not found.");

            var dto = new WarehouseDto
            {
                Id = warehouse.Id,
                Name = warehouse.Name,
                CompanyId = warehouse.CompanyId,
                CreatedAt = warehouse.CreatedAt,
                UpdatedAt = warehouse.UpdatedAt
            };

            return new SuccessDataResult<WarehouseDto>(dto);
        }

        public async Task<IDataResult<PagedResultDto<WarehouseDto>>> GetPagedListAsync(
            Guid companyId,
            int page,
            int pageSize,
            string? searchTerm = null)
        {
            var query = _baseRepository
                .GetAll(x => x.CompanyId == companyId && x.IsDeleted != true);

            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                query = query.Where(x => x.Name.Contains(searchTerm));
            }

            var totalCount = await query.CountAsync(); 

            var items = await query
                .OrderBy(x => x.Name)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(x => new WarehouseDto
                {
                    Id = x.Id,
                    Name = x.Name,
                    CompanyId = x.CompanyId,
                    CreatedAt = x.CreatedAt,
                    UpdatedAt = x.UpdatedAt
                })
                .ToListAsync(); 

            var result = new PagedResultDto<WarehouseDto>
            {
                Items = items,
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize
            };

            return new SuccessDataResult<PagedResultDto<WarehouseDto>>(result);
        }

        
    }
}