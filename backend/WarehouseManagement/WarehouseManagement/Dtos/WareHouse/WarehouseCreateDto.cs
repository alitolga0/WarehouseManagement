namespace WarehouseManagement.Dtos.WareHouse
{
    public class WarehouseCreateDto
    {
        public Guid CompanyId { get; set; }
        public string Name { get; set; } = null!;
    }
}
