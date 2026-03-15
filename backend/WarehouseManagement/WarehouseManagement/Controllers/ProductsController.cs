using Microsoft.AspNetCore.Mvc;
using WarehouseManagement.Dtos.Product;
using WarehouseManagement.Service.Abstract;
using IResult = WarehouseManagement.Core.Utilities.Results.IResult;

namespace WarehouseManagement.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController(IProductService productService) : ControllerBase
    {
        [HttpGet("get-all")]
        public async Task<IActionResult> GetAll([FromQuery] Guid companyId, int page = 1, int pageSize = 25, string? searchTerm = null)
            => ProcessResult(await productService.GetPagedListAsync(companyId, page, pageSize, searchTerm));

        [HttpGet("get-by-id")]
        public async Task<IActionResult> GetById([FromQuery] Guid id, [FromQuery] Guid companyId)
            => ProcessResult(await productService.GetByIdAsync(id, companyId));

        [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] ProductCreateDto dto)
            => ProcessResult(await productService.AddAsync(dto));

        [HttpPost("update")]
        public async Task<IActionResult> Update([FromBody] ProductUpdateDto dto)
            => ProcessResult(await productService.UpdateAsync(dto));

        [HttpPost("delete")]
        public async Task<IActionResult> Delete([FromQuery] Guid id, [FromQuery] Guid companyId)
            => ProcessResult(await productService.DeleteAsync(id, companyId));


        private IActionResult ProcessResult(IResult result)
            => result.Success ? Ok(result) : BadRequest(result);
    }
}