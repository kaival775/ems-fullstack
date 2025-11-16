import api from './api';

export const attendanceService = {
  mark: async (data) => {
    const response = await api.post('/attendance', data);
    return response.data;
  },

  getAll: async (params) => {
    const response = await api.get("/attendance", {
      params: { ...params, limit: 100 },
    });
    return response.data;
  },

  getToday: async () => {
    const response = await api.get('/attendance/today');
    return response.data;
  },

  getStats: async (params) => {
    const response = await api.get('/attendance/stats', { params });
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/attendance/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/attendance/${id}`);
    return response.data;
  }
};