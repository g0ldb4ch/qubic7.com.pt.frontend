import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Projects
export const projectsAPI = {
  getAll: () => api.get('/projects'),
  getById: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post('/projects', data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
  export: (id) => api.get(`/projects/${id}/export`)
};

// Subdomains
export const subdomainsAPI = {
  getByProject: (projectId) => api.get(`/subdomains/project/${projectId}`),
  getById: (id) => api.get(`/subdomains/${id}`),
  create: (projectId, data) => api.post(`/subdomains/project/${projectId}`, data),
  update: (id, data) => api.put(`/subdomains/${id}`, data),
  delete: (id) => api.delete(`/subdomains/${id}`)
};

// Tech Stacks
export const techStacksAPI = {
  getBySubdomain: (subdomainId) => api.get(`/techstacks/subdomain/${subdomainId}`),
  create: (subdomainId, data) => api.post(`/techstacks/subdomain/${subdomainId}`, data),
  update: (id, data) => api.put(`/techstacks/${id}`, data),
  delete: (id) => api.delete(`/techstacks/${id}`)
};

// Vulnerabilities
export const vulnerabilitiesAPI = {
  getBySubdomain: (subdomainId, params) => api.get(`/vulnerabilities/subdomain/${subdomainId}`, { params }),
  getById: (id) => api.get(`/vulnerabilities/${id}`),
  create: (subdomainId, data) => api.post(`/vulnerabilities/subdomain/${subdomainId}`, data),
  update: (id, data) => api.put(`/vulnerabilities/${id}`, data),
  delete: (id) => api.delete(`/vulnerabilities/${id}`),
  getStats: (projectId) => api.get(`/vulnerabilities/project/${projectId}/stats`)
};

export default api;