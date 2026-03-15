using Microsoft.AspNetCore.Mvc;
using WarehouseManagement.Service.Abstract;
using WarehouseManagement.Dtos.Company;
using IResult = WarehouseManagement.Core.Utilities.Results.IResult;

namespace WarehouseManagement.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    // Primary Constructor kullanarak servisi içeri alıyoruz
    public class CompaniesController(ICompanyService companyService) : ControllerBase
    {
        [HttpGet("get-all")]
        public async Task<IActionResult> GetPagedList(int page = 1, int pageSize = 10, string? searchTerm = null)
            => ProcessResult(await companyService.GetPagedListAsync(page, pageSize, searchTerm));

        [HttpGet("get-by-id/{id}")]
        public async Task<IActionResult> GetById(Guid id)
            => ProcessResult(await companyService.GetByIdAsync(id));

        [HttpPost("create")]
        public async Task<IActionResult> Add([FromBody] CompanyCreateDto dto)
            => ProcessResult(await companyService.AddAsync(dto));

        [HttpPost("update")]
        public async Task<IActionResult> Update([FromBody] CompanyUpdateDto dto)
            => ProcessResult(await companyService.UpdateAsync(dto));

        [HttpPost("delete")]
        public async Task<IActionResult> Delete([FromBody] DeleteDto dto)
            => ProcessResult(await companyService.DeleteAsync(dto.Id));

        private IActionResult ProcessResult(IResult result)
            => result.Success ? Ok(result) : BadRequest(result);
    }
}