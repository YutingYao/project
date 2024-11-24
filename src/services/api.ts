import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { message } from 'antd'; // 假设使用antd作为UI库
import { config } from '../config';

// 创建axios实例
const api = axios.create({
  baseURL: config.api.baseUrl,
  timeout: config.api.timeout,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 从localStorage获取token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // 可以在这里统一处理响应数据
    return response.data;
  },
  (error: AxiosError) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 未授权，跳转到登录页
          message.error('请先登录');
          // router.push('/login');
          break;
        case 403:
          message.error('没有权限访问');
          break;
        case 404:
          message.error('请求的资源不存在');
          break;
        case 500:
          message.error('服务器错误');
          break;
        default:
          message.error('网络错误');
      }
    } else if (error.request) {
      message.error('网络请求超时');
    } else {
      message.error('请求配置错误');
    }
    return Promise.reject(error);
  }
);

// 添加重试逻辑
api.interceptors.response.use(null, async (error) => {
  const { config: axiosConfig } = error;
  axiosConfig.retryCount = axiosConfig.retryCount ?? 0;
  
  if (axiosConfig.retryCount < config.api.retryCount) {
    axiosConfig.retryCount += 1;
    return api(axiosConfig);
  }
  return Promise.reject(error);
});

// 封装通用请求方法
export const request = {
  get: <T>(url: string, config = {}) => {
    return api.get<T>(url, config);
  },
  post: <T>(url: string, data = {}, config = {}) => {
    return api.post<T>(url, data, config);
  },
  put: <T>(url: string, data = {}, config = {}) => {
    return api.put<T>(url, data, config);
  },
  delete: <T>(url: string, config = {}) => {
    return api.delete<T>(url, config);
  }
};

export { api }; 