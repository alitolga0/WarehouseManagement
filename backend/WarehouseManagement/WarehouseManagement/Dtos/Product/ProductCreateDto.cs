namespace WarehouseManagement.Dtos.Product
{
    public class ProductCreateDto
    {
        public string Name { get; set; } = null!;
        public string Sku { get; set; } = null!;
        public string? Description { get; set; }
        public string Unit { get; set; } = "Adet";
        public int TotalStock { get; set; }
        public Guid CompanyId { get; set; }
    }
}
