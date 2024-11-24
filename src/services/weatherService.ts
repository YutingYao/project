import { useState, useEffect } from 'react';

export interface Location {
  name: string;
  lng: number;
  lat: number;
}

export interface WeatherData {
  time: string;
  area: string;
  weather: string;
  max_temperature: number;
  min_temperature: number;
  aqi: number;
  aqiLevel: number;
  wind_direction: string;
  wind_power: string;
  aqiInfo: string;
}

export const locations: Location[] = [
  { name: '胥湖心', lng: 120.4318, lat: 31.1593 },
  { name: '锡东水厂', lng: 120.3722, lat: 31.4483 },
  { name: '五里湖心', lng: 120.2573, lat: 31.5148 },
  { name: '乌龟山南', lng: 119.02, lat: 31.621 },
  { name: '平台山', lng: 120.11, lat: 31.233 }
];

export async function getWeatherData(location: Location): Promise<WeatherData[]> {
  try {
    const response = await fetch(`/000-weather_data_${location.name}.csv`);
    const text = await response.text();
    
    return text
      .split('\n')
      .slice(1) // Skip header
      .filter(line => line.trim()) // Remove empty lines
      .map(line => {
        const [
          time,
          area,
          weather,
          max_temperature,
          min_temperature,
          aqi,
          aqiLevel,
          wind_direction,
          wind_power,
          aqiInfo
        ] = line.split(',');

        return {
          time,
          area,
          weather,
          max_temperature: parseFloat(max_temperature),
          min_temperature: parseFloat(min_temperature),
          aqi: parseInt(aqi),
          aqiLevel: parseInt(aqiLevel),
          wind_direction,
          wind_power,
          aqiInfo
        };
      });
  } catch (error) {
    console.error('Error loading weather data:', error);
    return [];
  }
}