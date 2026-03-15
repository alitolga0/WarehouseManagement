using WarehouseManagement.Dtos.Inventory;
using IResult = WarehouseManagement.Core.Utilities.Results.IResult;

namespace WarehouseManagement.Service.Abstract
{
    public interface IInventoryService
    {
        Task<IResult> MoveStockAsync(StockMovementDto dto);
    }
}
