// API Base URL - uses environment variable or defaults to backend URL
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://kkh7ikcngl1l.manus.space';

// Helper to make API calls with full URL
export const apiUrl = (endpoint) => `${API_BASE_URL}${endpoint}`;

