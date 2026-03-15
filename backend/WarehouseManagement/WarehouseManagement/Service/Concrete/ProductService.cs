using Microsoft.EntityFrameworkCore;
using WarehouseManagement.Core.Repository;
using WarehouseManagement.Core.Utilities.Results;
using WarehouseManagement.Dtos.Product;
using WarehouseManagement.Models;
using WarehouseManagement.Repository;
using WarehouseManagement.Service.Abstract;
using IResult = WarehouseManagement.Core.Utilities.Results.IResult;

namespace WarehouseManagement.Service.Concrete
{
    public class ProductService(
        IUnitOfWork unitOfWork,
        IBaseRepository<Product> productRepository,
        MainDbContext context) : IProductService
    {
        public async Task<IResult> AddAsync(ProductCreateDto dto)
        {
            var product = new Product
            {
                Name = dto.Name,
                Sku = dto.Sku,
                Description = dto.Description,
                Unit = dto.Unit,
                CompanyId = dto.CompanyId
            };

            await productRepository.AddAsync(product);
            await unitOfWork.SaveChangesAsync();

            return new SuccessResult("Product defined successfully.");
        }

        public async Task<IResult> UpdateAsync(ProductUpdateDto dto)
        {

            var product = await productRepository.GetAsync(x =>
                x.Id == dto.Id &&
                x.CompanyId == dto.CompanyId &&
                x.IsDeleted != true);

            if (product == null) return new ErrorResult("Product not found");

            product.Name = dto.Name;
            product.Sku = dto.Sku;
            product.Description = dto.Description;
            product.Unit = dto.Unit;
            product.UpdatedAt = DateTime.UtcNow;

            context.Entry(product).State = EntityState.Modified;

            await unitOfWork.SaveChangesAsync();
            return new SuccessResult("Product updated successfully.");
        }

        public async Task<IResult> DeleteAsync(Guid id, Guid companyId)
        {
            var product = await productRepository.GetAsync(x =>
                x.Id == id &&
                x.CompanyId == companyId &&
                x.IsDeleted != true);

            if (product == null) return new ErrorResult("Product not found");

            await productRepository.DeleteAsync(id);
            await unitOfWork.SaveChangesAsync();

            return new SuccessResult("Product deleted successfully.");
        }

        public async Task<IDataResult<ProductDto>> GetByIdAsync(Guid id, Guid companyId)
        {
            var product = await productRepository.GetAsync(x =>
                x.Id == id &&
                x.CompanyId == companyId &&
                x.IsDeleted != true);

            if (product == null) return new ErrorDataResult<ProductDto>("Product not found");

            var result = new ProductDto
            {
                Id = product.Id,
                Name = product.Name,
                Sku = product.Sku,
                Unit = product.Unit,
                Description = product.Description,
                CompanyId = product.CompanyId,
                TotalStock = product.Inventories.Sum(x => x.Quantity)
            };

            return new SuccessDataResult<ProductDto>(result);
        }

        public async Task<IDataResult<PagedResultDto<ProductDto>>> GetPagedListAsync(
            Guid companyId, int page, int pageSize, string? searchTerm = null)
        {
            var query = productRepository.GetAll(x =>
                x.CompanyId == companyId && x.IsDeleted != true);

            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                query = query.Where(x => x.Name.Contains(searchTerm) || x.Sku.Contains(searchTerm));
            }

            var totalCount = await query.CountAsync();

            var items = await query
                .OrderByDescending(x => x.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(x => new ProductDto
                {
                    Id = x.Id,
                    Name = x.Name,
                    Sku = x.Sku,
                    Unit = x.Unit,
                    Description = x.Description,
                    CompanyId = x.CompanyId,
                    TotalStock = x.Inventories.Sum(i => i.Quantity)
                }).ToListAsync();

            var pagedResult = new PagedResultDto<ProductDto>
            {
                Items = items,
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize
            };

            return new SuccessDataResult<PagedResultDto<ProductDto>>(pagedResult);
        }
    }
}