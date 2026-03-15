using WarehouseManagement.Models;
using WarehouseManagement.Service.Abstract;
using WarehouseManagement.Core.Utilities.Results;
using WarehouseManagement.Core.Repository;
using WarehouseManagement.Dtos.Company;
using Microsoft.EntityFrameworkCore;
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
            // Id, CreatedAt ve IsDeleted artık BaseRepository.AddAsync içinde hallediliyor.
            Name = dto.Name
        };

        await _baseRepository.AddAsync(company);
        await _unitOfWork.SaveChangesAsync();

        return new SuccessResult("Company added successfully.");
    }

    public async Task<IResult> UpdateAsync(CompanyUpdateDto dto)
    {
        var company = await _baseRepository.GetAsync(x => x.Id == dto.Id);
        if (company == null)
            return new ErrorResult("Company not found.");

        // Sadece değişen alanları set et
        company.Name = dto.Name;

        // BaseRepository.UpdateAsync içinde zaten EntityState.Modified veya CurrentValues.SetValues yapıyorsun
        await _baseRepository.UpdateAsync(company);
        await _unitOfWork.SaveChangesAsync();

        return new SuccessResult("Company updated successfully.");
    }

    public async Task<IDataResult<CompanyDto>> GetByIdAsync(Guid id)
    {
        // BaseRepository'deki GetAllWithNavigation veya GetAsync kullanılabilir
        var company = await _baseRepository.GetAsync(x => x.Id == id && (x.IsDeleted == false || x.IsDeleted == null));

        if (company == null)
            return new ErrorDataResult<CompanyDto>(null, "Company not found.");

        return new SuccessDataResult<CompanyDto>(MapToDto(company));
    }

    public async Task<IResult> DeleteAsync(Guid id)
    {
        // BaseRepository içinde zaten Soft Delete mantığı yüklü (DeleteAsync metodun)
        try
        {
            await _baseRepository.DeleteAsync(id);
            await _unitOfWork.SaveChangesAsync();
            return new SuccessResult("Company deleted successfully.");
        }
        catch (Exception)
        {
            return new ErrorResult("Company not found.");
        }
    }

    public async Task<IDataResult<PagedResultDto<CompanyDto>>> GetPagedListAsync(int page, int pageSize, string? searchTerm = null)
    {
        var query = _baseRepository.GetAll(x => x.IsDeleted == false || x.IsDeleted == null);

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            query = query.Where(x => x.Name.Contains(searchTerm));
        }

        var totalCount = await query.CountAsync();

        var items = await query
            .OrderBy(x => x.Name)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(x => new CompanyDto
            {
                Id = x.Id,
                Name = x.Name,
                CreatedAt = x.CreatedAt,
                UpdatedAt = x.UpdatedAt
            })
            .ToListAsync();

        var result = new PagedResultDto<CompanyDto>
        {
            Items = items,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize
        };

        return new SuccessDataResult<PagedResultDto<CompanyDto>>(result);
    }

    // Kod tekrarını önlemek için küçük bir mapper
    private CompanyDto MapToDto(Company company)
    {
        return new CompanyDto
        {
            Id = company.Id,
            Name = company.Name,
            CreatedAt = company.CreatedAt,
            UpdatedAt = company.UpdatedAt
        };
    }
}