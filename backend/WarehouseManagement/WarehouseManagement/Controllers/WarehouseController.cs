using Microsoft.AspNetCore.Mvc;
using WarehouseManagement.Dtos.WareHouse;
using WarehouseManagement.Service.Abstract;
using IResult = WarehouseManagement.Core.Utilities.Results.IResult;

namespace WarehouseManagement.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WarehouseController(IWarehouseService warehouseService) : ControllerBase
    {
        [HttpGet("get-all")]
        public async Task<IActionResult> GetAll([FromQuery] Guid companyId, int page = 1, int pageSize = 25, string? searchTerm = null)
            => ProcessResult(await warehouseService.GetPagedListAsync(companyId, page, pageSize, searchTerm));

        [HttpGet("get-by-id")]
        public async Task<IActionResult> GetById([FromQuery] Guid id, [FromQuery] Guid companyId)
            => ProcessResult(await warehouseService.GetByIdAsync(id, companyId));

        [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] WarehouseCreateDto dto)
            => ProcessResult(await warehouseService.AddAsync(dto));

        [HttpPost("update")]
        public async Task<IActionResult> Update([FromBody] WarehouseUpdateDto dto)
            => ProcessResult(await warehouseService.UpdateAsync(dto));

        [HttpPost("delete")]
        public async Task<IActionResult> Delete([FromQuery] Guid id, [FromQuery] Guid companyId)
            => ProcessResult(await warehouseService.DeleteAsync(id, companyId));


        private IActionResult ProcessResult(IResult result)
            => result.Success ? Ok(result) : BadRequest(result);
    }
}