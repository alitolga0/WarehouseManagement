namespace WarehouseManagement.Models
{
    public class Warehouse : BaseEntity
    {
        public string Name { get; set; } = null!;
        public Guid CompanyId { get; set; }

        // Navigation
        public Company Company { get; set; } = null!;
        public ICollection<Inventory> Inventories { get; set; } = new List<Inventory>();
    }
}
