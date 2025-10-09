import api from "../config/apiConfig";

const BASE = "/api/walkpaths";

export const listWalkPaths = () => api.get(BASE);
export const getWalkPath = (id) => api.get(`${BASE}/${id}`);
export const createWalkPath = (payload) => api.post(BASE, payload);
export const updateWalkPath = (id, payload) => api.put(`${BASE}/${id}`, payload);
export const deleteWalkPath = (id) => api.delete(`${BASE}/${id}`);
