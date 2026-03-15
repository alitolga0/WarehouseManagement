namespace WarehouseManagement.Models
{
    public class Product : BaseEntity
    {
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public string Sku { get; set; } = null!;
        public string Unit { get; set; } = null!;
        public int TotalStock { get; set; }
        public Guid CompanyId { get; set; }


        public Company Company { get; set; } = null!;
        public ICollection<Inventory> Inventories { get; set; } = new List<Inventory>();
    }
}
