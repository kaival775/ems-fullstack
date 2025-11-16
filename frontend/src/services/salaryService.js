import api from './api';

export const salaryService = {
  getAll: () => api.get('/salaries'),
  create: (data) => api.post('/salaries', data),
  updateStatus: (id, data) => api.patch(`/salaries/${id}/status`, data),
  delete: (id) => api.delete(`/salaries/${id}`)
};
