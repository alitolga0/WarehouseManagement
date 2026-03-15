namespace WarehouseManagement.Dtos.Product
{
    public class ProductUpdateDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = null!;
        public string Sku { get; set; } = null!;
        public string? Description { get; set; }
        public string Unit { get; set; } = null!;
        public int TotalStock { get; set; }
        public Guid CompanyId { get; set; }
    }
}
