import api from "../api/axios"; 

export const InventoriesService = {
  moveStock: async (data: { productId: string; warehouseId: string; quantity: number; companyId: string }) => {
    return api.post("/Inventories/move-stock", data);
  }
};