import api from './api';

export const leaveService = {
  getAll: () => api.get('/leaves'),
  create: (data) => api.post('/leaves', data),
  updateStatus: (id, data) => api.patch(`/leaves/${id}/status`, data),
  delete: (id) => api.delete(`/leaves/${id}`)
};
