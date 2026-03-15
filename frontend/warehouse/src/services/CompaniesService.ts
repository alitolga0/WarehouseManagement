import api from "../api/axios";

export interface CompanyCreateDto {
  name: string;
}

export interface CompanyUpdateDto {
  id: string;
  name: string;
}

export class CompaniesService {

  static async getAll(page: number = 1, pageSize: number = 10) {
    const response = await api.get("/Companies/get-all", {
      params: { page, pageSize },
    });
    return response.data;
  }

  static async getById(id: string) {
    const response = await api.get(`/Companies/get-by-id/${id}`);
    return response.data;
  }

  static async create(dto: CompanyCreateDto) {
    const response = await api.post("/Companies/create", dto);
    return response.data;
  }

  static async update(dto: CompanyUpdateDto) {
    const response = await api.post("/Companies/update", dto);
    return response.data;
  }

  static async delete(id: string) {
    const response = await api.post("/Companies/delete", { id });
    return response.data;
  }
}