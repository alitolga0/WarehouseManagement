using Microsoft.AspNetCore.Mvc;
using WarehouseManagement.Service.Abstract;
using WarehouseManagement.Dtos.Company;

namespace WarehouseManagement.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CompaniesController : ControllerBase
    {
        private readonly ICompanyService _companyService;

        public CompaniesController(ICompanyService companyService)
        {
            _companyService = companyService;
        }

        [HttpGet("getall-paged")]
        public async Task<IActionResult> GetPagedList(int page = 1, int pageSize = 10, string? searchTerm = null)
        {
            var result = await _companyService.GetPagedListAsync(page, pageSize, searchTerm);

            if (result.Success)
                return Ok(result);

            return BadRequest(result);
        }

        [HttpGet("getbyid/{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var result = await _companyService.GetByIdAsync(id);

            if (result.Success)
                return Ok(result);

            return NotFound(result);
        }

        [HttpPost("create")]
        public async Task<IActionResult> Add([FromBody] CompanyCreateDto dto)
        {
            var result = await _companyService.AddAsync(dto);

            if (result.Success)
                return Ok(result);

            return BadRequest(result);
        }

        [HttpPost("update")]
        public async Task<IActionResult> Update([FromBody] CompanyUpdateDto dto)
        {
            var result = await _companyService.UpdateAsync(dto);

            if (result.Success)
                return Ok(result);

            return BadRequest(result);
        }

        [HttpPost("delete")]
        public async Task<IActionResult> Delete([FromBody] DeleteDto dto)
        {
            var result = await _companyService.DeleteAsync(dto.Id);

            if (result.Success)
                return Ok(result);

            return BadRequest(result);
        }
    }
}