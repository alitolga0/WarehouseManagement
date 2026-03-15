using WarehouseManagement.Models;
using WarehouseManagement.Service.Abstract;
using WarehouseManagement.Core.Utilities.Results;
using WarehouseManagement.Core.Repository;
using WarehouseManagement.Dtos.Company;
using IResult = WarehouseManagement.Core.Utilities.Results.IResult;

public class CompanyService : ICompanyService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IBaseRepository<Company> _baseRepository;

    public CompanyService(IUnitOfWork unitOfWork, IBaseRepository<Company> baseRepository)
    {
        _unitOfWork = unitOfWork;
        _baseRepository = baseRepository;
    }

    public async Task<IResult> AddAsync(CompanyCreateDto dto)
    {
        var company = new Company
        {
            Id = Guid.NewGuid(),
            Name = dto.Name,
            CreatedAt = DateTime.UtcNow,
            IsDeleted = false
        };

        await _baseRepository.Add(company);
        await _unitOfWork.SaveChangesAsync();

        return new SuccessResult("Company added successfully.");
    }

    public async Task<IResult> UpdateAsync(CompanyUpdateDto dto)
    {
        var company = _baseRepository.Get(x => x.Id == dto.Id);

        if (company == null)
            return new ErrorResult("Company not found.");

        company.Name = dto.Name;
        company.UpdatedAt = DateTime.UtcNow;

        await _baseRepository.Update(company);
        await _unitOfWork.SaveChangesAsync();

        return new SuccessResult("Company updated successfully.");
    }

    public async Task<IDataResult<CompanyDto>> GetByIdAsync(Guid id)
    {
        var company = _baseRepository.Get(x => x.Id == id && (x.IsDeleted == false || x.IsDeleted == null));

        if (company == null)
            return new ErrorDataResult<CompanyDto>(null, "Company not found.");

        var dto = new CompanyDto
        {
            Id = company.Id,
            Name = company.Name,
            CreatedAt = company.CreatedAt,
            UpdatedAt = company.UpdatedAt
        };

        return new SuccessDataResult<CompanyDto>(dto);
    }

    public async Task<IResult> DeleteAsync(Guid id)
    {
        var company = _baseRepository.Get(x => x.Id == id);

        if (company == null)
            return new ErrorResult("Company not found.");

        company.IsDeleted = true;
        company.DeletedAt = DateTime.UtcNow;

        await _baseRepository.Update(company);
        await _unitOfWork.SaveChangesAsync();

        return new SuccessResult("Company deleted successfully.");
    }

    public async Task<IDataResult<PagedResultDto<CompanyDto>>> GetPagedListAsync(int page, int pageSize, string? searchTerm = null)
    {
        var query = _baseRepository
            .GetAll()
            .Where(x => x.IsDeleted == false || x.IsDeleted == null);

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            query = query.Where(x => x.Name.Contains(searchTerm));
        }

        var totalCount = query.Count();

        var items = query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(x => new CompanyDto
            {
                Id = x.Id,
                Name = x.Name,
                CreatedAt = x.CreatedAt,
                UpdatedAt = x.UpdatedAt
            })
            .ToList();

        var result = new PagedResultDto<CompanyDto>
        {
            Items = items,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize
        };

        return new SuccessDataResult<PagedResultDto<CompanyDto>>(result);
    }
}