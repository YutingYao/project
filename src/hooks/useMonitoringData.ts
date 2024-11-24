import { useState, useEffect, useCallback } from 'react';
import { Station } from '../data/stationData';
import { MonitoringRecord } from '../services/db';
import { fetchAndStoreMonitoringData, getLatestMonitoringData } from '../services/monitoringService';
import { APIError } from '../services/realtimeService';
import { REFRESH_INTERVAL, MAX_RETRIES, CACHE_DURATION } from '../constants';

export function useMonitoringData(station: Station) {
  const [data, setData] = useState<MonitoringRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | APIError | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchData = useCallback(async (retryCount = 0) => {
    try {
      setLoading(true);
      setError(null);

      // 检查缓存是否有效
      const cachedData = await getLatestMonitoringData(station);
      const isCacheValid = cachedData && 
        (new Date().getTime() - new Date(cachedData.timestamp).getTime() < CACHE_DURATION);

      if (isCacheValid) {
        setData(cachedData);
        setLastUpdate(new Date(cachedData.timestamp));
        return;
      }

      // 缓存无效或不存在时，从服务器获取新数据
      await fetchAndStoreMonitoringData();
      const freshData = await getLatestMonitoringData(station);

      if (freshData) {
        setData(freshData);
        setLastUpdate(new Date(freshData.timestamp));
      } else {
        throw new Error('暂无监测数据');
      }
    } catch (err) {
      console.error('Error fetching monitoring data:', err);
      
      // 实现重试机制
      if (retryCount < MAX_RETRIES) {
        setTimeout(() => fetchData(retryCount + 1), 1000 * (retryCount + 1));
        return;
      }

      if (err instanceof Error) {
        setError(err);
      } else {
        setError(new Error('获取监测数据失败'));
      }
    } finally {
      setLoading(false);
    }
  }, [station]);

  useEffect(() => {
    let mounted = true;
    let intervalId: NodeJS.Timeout;

    // 初始加载
    if (mounted) {
      fetchData();
    }

    // 设置定时刷新
    intervalId = setInterval(() => {
      if (mounted) {
        fetchData();
      }
    }, REFRESH_INTERVAL);

    return () => {
      mounted = false;
      clearInterval(intervalId);
    };
  }, [fetchData]);

  return { data, loading, error, lastUpdate, refresh: fetchData };
}