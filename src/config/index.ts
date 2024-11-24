export const config = {
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    timeout: 10000,
    retryCount: 3
  },
  cache: {
    duration: 5 * 60 * 1000 // 5分钟
  },
  map: {
    center: [31.3, 120],
    zoom: 9
  }
}; 