import React from 'react';
import { Wind, Thermometer, Activity, Droplets } from 'lucide-react';
import { useWeatherData } from '../hooks/useWeatherData';
import { locations } from '../services/weatherService';

export function Header() {
  const { currentWeather, loading, error } = useWeatherData(locations[0]); // Using 胥湖心 as default

  return (
    <header className="bg-blue-950/50 backdrop-blur-sm p-6 shadow-lg">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Droplets className="h-8 w-8" />
          太湖流域水生态要素监控分析系统
        </h1>
        {loading ? (
          <div className="text-blue-200">加载中...</div>
        ) : error ? (
          <div className="text-red-400">获取天气数据失败</div>
        ) : currentWeather && (
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Wind className="h-5 w-5" />
              <span>{currentWeather.wind_direction} {currentWeather.wind_power}</span>
            </div>
            <div className="flex items-center gap-2">
              <Thermometer className="h-5 w-5" />
              <span>{currentWeather.max_temperature}°C</span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              <span>AQI: {currentWeather.aqi} {currentWeather.aqiInfo}</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}