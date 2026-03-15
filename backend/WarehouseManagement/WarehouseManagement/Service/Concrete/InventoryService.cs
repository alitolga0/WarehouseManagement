using Microsoft.EntityFrameworkCore;
using WarehouseManagement.Core.Repository;
using WarehouseManagement.Core.Utilities.Results;
using WarehouseManagement.Dtos.Inventory;
using WarehouseManagement.Models;
using WarehouseManagement.Service.Abstract;
using WarehouseManagement.Repository;
using IResult = WarehouseManagement.Core.Utilities.Results.IResult;

namespace WarehouseManagement.Service.Concrete
{
    public class InventoryService(
        IBaseRepository<Inventory> inventoryRepository,
        IUnitOfWork unitOfWork,
        MainDbContext context) : IInventoryService
    {
        public async Task<IResult> MoveStockAsync(StockMovementDto dto)
        {
            var inventory = await inventoryRepository.GetAsync(x =>
                x.ProductId == dto.ProductId &&
                x.WarehouseId == dto.WarehouseId &&
                x.CompanyId == dto.CompanyId &&
                x.IsDeleted != true);

            if (inventory == null)
            {

                if (dto.Quantity <= 0)
                    return new ErrorResult("Cannot perform stock out for a non-existent inventory record.");

                inventory = new Inventory
                {
                    ProductId = dto.ProductId,
                    WarehouseId = dto.WarehouseId,
                    Quantity = dto.Quantity,
                    CompanyId = dto.CompanyId
                };
                await inventoryRepository.AddAsync(inventory);
            }
            else
            {
                inventory.Quantity += dto.Quantity;
                inventory.UpdatedAt = DateTime.UtcNow;

                if (inventory.Quantity < 0)
                    return new ErrorResult("Insufficient stock level! The current quantity cannot cover this movement.");

                context.Entry(inventory).State = EntityState.Modified;
            }

            await unitOfWork.SaveChangesAsync();
            return new SuccessResult("Stock movement (In/Out) completed successfully.");
        }
    }
}