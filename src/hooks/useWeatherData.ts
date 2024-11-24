import { useState, useEffect } from 'react';
import { Location, WeatherData, getWeatherData } from '../services/weatherService';

export function useWeatherData(location: Location) {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      // If we have recent data (less than 5 minutes old), don't fetch again
      if (lastUpdate && new Date().getTime() - lastUpdate.getTime() < 300000) {
        return;
      }

      try {
        const data = await getWeatherData(location);
        if (!mounted) return;
        
        if (data.length > 0) {
          setWeatherData(data);
          setError(null);
          setLastUpdate(new Date());
        } else {
          setError('No weather data available');
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
  }, [location, lastUpdate]);

  // Get the most recent weather data
  const currentWeather = weatherData.length > 0 ? weatherData[weatherData.length - 1] : null;

  return { weatherData, currentWeather, loading, error };
}