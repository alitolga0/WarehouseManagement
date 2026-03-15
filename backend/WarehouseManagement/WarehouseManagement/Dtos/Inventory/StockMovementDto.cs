namespace WarehouseManagement.Dtos.Inventory
{
    public class StockMovementDto
    {
        public Guid ProductId { get; set; }
        public Guid WarehouseId { get; set; }
        public int Quantity { get; set; } 
        public Guid CompanyId { get; set; }
    }
}
