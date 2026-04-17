// API Configuration
// Use VITE_API_BASE_URL env variable in production (Vercel)
// Fallback to empty string for local development (uses proxy)
const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
export const API_URL = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
