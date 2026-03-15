import api from "../api/axios";

export interface ProductCreateDto {
  name: string;
  sku: string;
  description: string;
  unit: string;
  totalStock: number;
  companyId: string;
}

export interface ProductUpdateDto extends ProductCreateDto {
  id: string;
}

export const ProductsService = {

  getAll: async (companyId: string, page: number = 1, pageSize: number = 25) => {
    return api.get("/Products/get-all", {
      params: { companyId, page, pageSize }
    });
  },


  create: async (data: ProductCreateDto) => {
    return api.post("/Products/create", data);
  },

 
  update: async (data: ProductUpdateDto) => {
    return api.post("/Products/update", data);
  },

  delete: async (id: string, companyId: string) => {
    return api.post("/Products/delete", null, {
      params: { id, companyId }
    });
  }
};