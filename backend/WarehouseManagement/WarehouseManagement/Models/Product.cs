namespace WarehouseManagement.Models
{
    public class Product : BaseEntity
    {
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public Guid CompanyId { get; set; }

        // Navigation
        public Company Company { get; set; } = null!;
        public ICollection<Inventory> Inventories { get; set; } = new List<Inventory>();
    }
}
