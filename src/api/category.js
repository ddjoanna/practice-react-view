import api from "./axios";

export const getCategories = (params = {}) =>
  api.get("/categories", { params });
export const createCategory = (data) => api.post("/categories", data);
export const updateCategory = (id, data) => api.put(`/categories/${id}`, data);
export const deleteCategory = (id) => api.delete(`/categories/${id}`);
