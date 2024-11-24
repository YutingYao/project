// 通用响应格式
export interface ApiResponse<T = any> {
  code: number;
  data: T;
  message: string;
}

// 分页响应格式
export interface PaginatedResponse<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

// 分页请求参数
export interface PaginationParams {
  page: number;
  pageSize: number;
} 