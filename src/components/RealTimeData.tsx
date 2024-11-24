import React from 'react';
import { Activity, AlertCircle, Cloud, Droplets } from 'lucide-react';
import { Station } from '../data/stationData';
import { useMonitoringData } from '../hooks/useMonitoringData';
import { useWeatherData } from '../hooks/useWeatherData';
import { APIError } from '../services/realtimeService';

interface RealTimeDataProps {
  station: Station;
}

export function RealTimeData({ station }: RealTimeDataProps) {
  const { 
    data: monitoringData, 
    loading: monitoringLoading, 
    error: monitoringError, 
    lastUpdate: monitoringLastUpdate 
  } = useMonitoringData(station);

  const {
    currentWeather: weatherData,
    loading: weatherLoading,
    error: weatherError,
    lastUpdate: weatherLastUpdate
  } = useWeatherData(station);

  const renderError = (error: Error | APIError | null) => {
    if (!error) return null;
    
    const apiError = error as APIError;
    return (
      <div className="flex flex-col items-start gap-4">
        <div className="flex items-center gap-2 text-red-400">
          <AlertCircle className="h-5 w-5" />
          <span className="font-semibold">获取数据失败</span>
        </div>
        {apiError.code ? (
          <>
            <div className="bg-red-950/50 rounded-lg p-4 w-full">
              <div className="text-red-300 font-mono mb-2">错误码: {apiError.code}</div>
              <div className="text-red-200 mb-1">{apiError.message}</div>
              <div className="text-red-400 text-sm">{apiError.description}</div>
            </div>
            <div className="text-gray-400 text-sm">
              请检查系统配置或稍后重试
            </div>
          </>
        ) : (
          <div className="text-red-400">{error.toString()}</div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* 地面监测站数据 */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Droplets className="h-5 w-5" />
            {station.name} - 地面监测站数据
          </h3>
          {monitoringLastUpdate && (
            <div className="text-sm text-gray-400">
              更新于: {new Date(monitoringLastUpdate).toLocaleString()}
              <div className="text-xs">(每24小时更新一次)</div>
            </div>
          )}
        </div>

        {monitoringLoading ? (
          <div className="animate-pulse space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="h-24 bg-white/5 rounded-lg"></div>
              ))}
            </div>
          </div>
        ) : monitoringError ? (
          renderError(monitoringError)
        ) : !monitoringData ? (
          <div className="text-gray-400">暂无监测数据</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-sm text-gray-400">水温</div>
              <div className="text-2xl font-semibold">{monitoringData.water_temp.toFixed(1)}°C</div>
            </div>
            
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-sm text-gray-400">pH值</div>
              <div className="text-2xl font-semibold">{monitoringData.ph.toFixed(2)}</div>
            </div>
            
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-sm text-gray-400">溶解氧</div>
              <div className="text-2xl font-semibold">{monitoringData.dissolvedoxygen.toFixed(2)} mg/L</div>
            </div>
            
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-sm text-gray-400">高锰酸盐指数</div>
              <div className="text-2xl font-semibold">{monitoringData.codmn.toFixed(2)} mg/L</div>
            </div>
            
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-sm text-gray-400">氨氮</div>
              <div className="text-2xl font-semibold">{monitoringData.nh3n.toFixed(3)} mg/L</div>
            </div>
            
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-sm text-gray-400">总磷</div>
              <div className="text-2xl font-semibold">{monitoringData.tp.toFixed(3)} mg/L</div>
            </div>
            
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-sm text-gray-400">总氮</div>
              <div className="text-2xl font-semibold">{monitoringData.tn.toFixed(2)} mg/L</div>
            </div>
            
            {monitoringData.chlorophyll !== undefined && (
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-sm text-gray-400">叶绿素a</div>
                <div className="text-2xl font-semibold">{monitoringData.chlorophyll.toFixed(3)} mg/L</div>
              </div>
            )}
            
            {monitoringData.algal_density !== undefined && (
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-sm text-gray-400">藻密度</div>
                <div className="text-2xl font-semibold">{monitoringData.algal_density.toExponential(2)} cells/L</div>
              </div>
            )}
          </div>
        )}

        {monitoringData && (
          <div className="mt-6 flex justify-between items-center bg-white/5 rounded-lg p-4">
            <div>
              <div className="text-sm text-gray-400">水质等级</div>
              <div className="text-xl font-semibold">{monitoringData.quality}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400">监测点状态</div>
              <div className="text-xl font-semibold">{monitoringData.section_status}</div>
            </div>
          </div>
        )}
      </div>

      {/* 气象数据 */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Cloud className="h-5 w-5" />
            {station.name} - 气象数据
          </h3>
          {weatherLastUpdate && (
            <div className="text-sm text-gray-400">
              更新于: {new Date(weatherLastUpdate).toLocaleString()}
              <div className="text-xs">(每24小时更新一次)</div>
            </div>
          )}
        </div>

        {weatherLoading ? (
          <div className="animate-pulse space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-24 bg-white/5 rounded-lg"></div>
              ))}
            </div>
          </div>
        ) : weatherError ? (
          renderError(weatherError)
        ) : !weatherData ? (
          <div className="text-gray-400">暂无气象数据</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-sm text-gray-400">天气</div>
              <div className="text-2xl font-semibold">{weatherData.weather}</div>
            </div>
            
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-sm text-gray-400">最高温度</div>
              <div className="text-2xl font-semibold">{weatherData.max_temperature}°C</div>
            </div>
            
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-sm text-gray-400">最低温度</div>
              <div className="text-2xl font-semibold">{weatherData.min_temperature}°C</div>
            </div>
            
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-sm text-gray-400">风向</div>
              <div className="text-2xl font-semibold">{weatherData.wind_direction}</div>
            </div>
            
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-sm text-gray-400">风力</div>
              <div className="text-2xl font-semibold">{weatherData.wind_power}</div>
            </div>
            
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-sm text-gray-400">空气质量</div>
              <div className="text-2xl font-semibold">
                AQI: {weatherData.aqi} ({weatherData.aqiInfo})
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}