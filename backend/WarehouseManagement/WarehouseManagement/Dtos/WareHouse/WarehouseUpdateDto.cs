namespace WarehouseManagement.Dtos.WareHouse
{
    public class WarehouseUpdateDto
    {
        public Guid Id { get; set; }
        public Guid CompanyId { get; set; }
        public string Name { get; set; } = null!;
    }
}
