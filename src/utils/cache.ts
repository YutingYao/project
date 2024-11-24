import { MonitoringRecord } from '../services/db';

// 缓存持续时间设置为5分钟
const CACHE_DURATION = 5 * 60 * 1000;

// 缓存项接口定义
interface CacheItem<T> {
  data: T;
  timestamp: number;
}

// 通用缓存类
export class Cache<T> {
  private store: Map<string, CacheItem<T>> = new Map();

  // 设置缓存
  set(key: string, data: T): void {
    this.store.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  // 获取缓存
  get(key: string): T | null {
    const item = this.store.get(key);
    if (!item) return null;

    // 检查缓存是否过期
    if (Date.now() - item.timestamp > CACHE_DURATION) {
      this.store.delete(key);
      return null;
    }

    return item.data;
  }

  // 清除指定缓存
  delete(key: string): void {
    this.store.delete(key);
  }

  // 清除所有缓存
  clear(): void {
    this.store.clear();
  }
}

// 导出监控记录缓存实例
export const monitoringCache = new Cache<MonitoringRecord>(); 