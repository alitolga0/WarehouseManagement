namespace WarehouseManagement.Models
{
    public class Company : BaseEntity
    {
        public string Name { get; set; } = null!;

        public ICollection<Product> Products { get; set; } = new List<Product>();
        public ICollection<Warehouse> Warehouses { get; set; } = new List<Warehouse>();
    }
}
