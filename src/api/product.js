import api from "@/api/axios";

export const getProducts = (params = {}) => api.get("/products", { params });
export const createProduct = (data) => api.post("/products", data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);
