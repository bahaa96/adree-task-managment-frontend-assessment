const config = {
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  ENVIRONMENT: import.meta.env.MODE || 'development',
};

export default config;
