import api from "../api/axios"; 

export const WarehousesService = {

  getAll: async (companyId: string, page: number = 1, pageSize: number = 25) => {
    return api.get("/Warehouse/get-all", {
      params: { companyId, page, pageSize }
    });
  },

  create: async (data: { companyId: string; name: string }) => {
    return api.post("/Warehouse/create", data);
  },

  update: async (data: { id: string; companyId: string; name: string }) => {
    return api.post("/Warehouse/update", data);
  },


  delete: async (id: string, companyId: string) => {
    return api.post("/Warehouse/delete", null, {
      params: { id, companyId }
    });
  }
};