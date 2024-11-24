export interface WeatherData {
  time: string;
  area: string;
  weather: string;
  maxTemperature: number;
  minTemperature: number;
  aqi: number;
  aqiLevel: number;
  windDirection: string;
  windPower: string;
  aqiInfo: string;
}

export const weatherData: WeatherData[] = [
  {
    time: '20210101',
    area: '宜兴',
    weather: '雨夹雪-晴',
    maxTemperature: 4,
    minTemperature: -4,
    aqi: 60,
    aqiLevel: 2,
    windDirection: '西南风',
    windPower: '2级',
    aqiInfo: '良'
  },
  {
    time: '20210102',
    area: '宜兴',
    weather: '多云-晴',
    maxTemperature: 7,
    minTemperature: -2,
    aqi: 89,
    aqiLevel: 2,
    windDirection: '东南风',
    windPower: '2级',
    aqiInfo: '良'
  },
  {
    time: '20210103',
    area: '宜兴',
    weather: '晴',
    maxTemperature: 9,
    minTemperature: 4,
    aqi: 93,
    aqiLevel: 2,
    windDirection: '东南风',
    windPower: '3级',
    aqiInfo: '良'
  },
  {
    time: '20210104',
    area: '宜兴',
    weather: '阴-小雨',
    maxTemperature: 11,
    minTemperature: 4,
    aqi: 67,
    aqiLevel: 2,
    windDirection: '东风',
    windPower: '2级',
    aqiInfo: '良'
  }
];