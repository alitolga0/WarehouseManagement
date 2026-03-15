using Microsoft.AspNetCore.Mvc;
using WarehouseManagement.Dtos.Inventory;
using WarehouseManagement.Service.Abstract;
using IResult = WarehouseManagement.Core.Utilities.Results.IResult;

namespace WarehouseManagement.Controllers
{
    [ApiController]
    [Route("api/[controller]")]

    public class InventoriesController(IInventoryService inventoryService) : ControllerBase
    {
        [HttpPost("move-stock")]
        public async Task<IActionResult> MoveStock([FromBody] StockMovementDto dto)
            => ProcessResult(await inventoryService.MoveStockAsync(dto));

        private IActionResult ProcessResult(IResult result)
            => result.Success ? Ok(result) : BadRequest(result);
    }
}