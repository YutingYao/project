import { useState, useEffect } from 'react';
import { Station } from '../data/stationData';
import { RealTimeData, getRealTimeData } from '../services/realtimeService';

export function useRealTimeData(station: Station) {
  const [data, setData] = useState<RealTimeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    let mounted = true;
    let retryCount = 0;
    const maxRetries = 3;
    const retryDelay = 2000; // 2 seconds

    async function fetchData() {
      // If we have recent data (less than 5 minutes old), don't fetch again
      if (lastUpdate && new Date().getTime() - lastUpdate.getTime() < 300000) {
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const result = await getRealTimeData(station);
        
        if (!mounted) return;

        if (result) {
          setData(result);
          setLastUpdate(new Date());
          retryCount = 0; // Reset retry count on success
        } else {
          throw new Error('暂无实时数据');
        }
      } catch (err) {
        if (!mounted) return;
        
        const errorMessage = err instanceof Error ? err.message : '获取数据失败';
        console.error('Error fetching real-time data:', errorMessage);
        
        if (retryCount < maxRetries) {
          retryCount++;
          console.log(`Retrying... Attempt ${retryCount} of ${maxRetries}`);
          setTimeout(fetchData, retryDelay * retryCount); // Exponential backoff
        } else {
          setError(errorMessage);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchData();

    // Set up polling every 5 minutes
    const interval = setInterval(fetchData, 300000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [station, lastUpdate]);

  return { data, loading, error, lastUpdate };
}