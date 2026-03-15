namespace WarehouseManagement.Models
{
    public class Inventory : BaseEntity
    {
        public Guid ProductId { get; set; }
        public Guid WarehouseId { get; set; }
        public int Quantity { get; set; }
        public Guid CompanyId { get; set; }

        // Navigation
        public Product Product { get; set; } = null!;
        public Warehouse Warehouse { get; set; } = null!;
    }
}
