import axios from 'axios';

const API_BASE = 'https://localhost:7001/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('hms_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 — redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('hms_token');
      localStorage.removeItem('hms_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authApi = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
};

// ── Dashboard ─────────────────────────────────────────────────────────────────
export const dashboardApi = {
  get: () => api.get('/dashboard'),
};

// ── Hospitals ─────────────────────────────────────────────────────────────────
export const hospitalsApi = {
  getAll: () => api.get('/hospitals'),
  getById: (id) => api.get(`/hospitals/${id}`),
  create: (data) => api.post('/hospitals', data),
  update: (id, data) => api.put(`/hospitals/${id}`, data),
  delete: (id) => api.delete(`/hospitals/${id}`),
};

// ── Departments ───────────────────────────────────────────────────────────────
export const departmentsApi = {
  getAll: () => api.get('/departments'),
  create: (data) => api.post('/departments', data),
  update: (id, data) => api.put(`/departments/${id}`, data),
  delete: (id) => api.delete(`/departments/${id}`),
};

// ── Doctors ───────────────────────────────────────────────────────────────────
export const doctorsApi = {
  getAll: () => api.get('/doctors'),
  getById: (id) => api.get(`/doctors/${id}`),
  create: (data) => api.post('/doctors', data),
  update: (id, data) => api.put(`/doctors/${id}`, data),
  delete: (id) => api.delete(`/doctors/${id}`),
};

// ── Patients ──────────────────────────────────────────────────────────────────
export const patientsApi = {
  getAll: () => api.get('/patients'),
  getById: (id) => api.get(`/patients/${id}`),
  create: (data) => api.post('/patients', data),
  update: (id, data) => api.put(`/patients/${id}`, data),
  delete: (id) => api.delete(`/patients/${id}`),
};

// ── Appointments ──────────────────────────────────────────────────────────────
export const appointmentsApi = {
  getAll: (params) => api.get('/appointments', { params }),
  create: (data) => api.post('/appointments', data),
  updateStatus: (id, data) => api.patch(`/appointments/${id}/status`, data),
};

// ── Wards ─────────────────────────────────────────────────────────────────────
export const wardsApi = {
  getAll: () => api.get('/wards'),
  create: (data) => api.post('/wards', data),
  update: (id, data) => api.put(`/wards/${id}`, data),
};

// ── Beds ──────────────────────────────────────────────────────────────────────
export const bedsApi = {
  getAll: (wardId) => api.get('/beds', { params: wardId ? { wardId } : {} }),
  updateStatus: (id, data) => api.patch(`/beds/${id}/status`, data),
};

// ── OPD ───────────────────────────────────────────────────────────────────────
export const opdApi = {
  getAll: (params) => api.get('/opd', { params }),
  create: (data) => api.post('/opd', data),
};

// ── IPD ───────────────────────────────────────────────────────────────────────
export const ipdApi = {
  getAll: (params) => api.get('/ipd', { params }),
  admit: (data) => api.post('/ipd', data),
  discharge: (id, data) => api.patch(`/ipd/${id}/discharge`, data),
};

// ── Billing ───────────────────────────────────────────────────────────────────
export const billingApi = {
  getAll: (params) => api.get('/billing', { params }),
  create: (data) => api.post('/billing', data),
};

export default api;
