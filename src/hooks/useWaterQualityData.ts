import { useState, useEffect } from 'react';
import { Station } from '../data/stationData';
import { WaterQualityData, getWaterQualityData } from '../services/monitoringService';

export function useWaterQualityData(station: Station) {
  const [data, setData] = useState<WaterQualityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      try {
        setLoading(true);
        const result = await getWaterQualityData(station);
        if (!mounted) return;
        
        if (result.length > 0) {
          setData(result);
          setError(null);
        } else {
          setError('No water quality data available');
        }
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      mounted = false;
    };
  }, [station]);

  return { data, loading, error };
}