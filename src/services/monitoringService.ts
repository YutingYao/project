import axios from 'axios';
import { db, MonitoringRecord } from './db';
import { Station } from '../data/stationData';

export interface WaterQualityData {
  date: string;
  temperature: number;
  pH: number;
  oxygen: number;
  permanganate: number;
  NH: number;
  TP: number;
  TN: number;
  conductivity: number;
  turbidity: number;
  chla: number;
  density: number;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
const FETCH_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export async function shouldFetchData(): Promise<boolean> {
  try {
    const lastFetchTime = await db.getLastFetchTime();
    if (!lastFetchTime) return true;
    return Date.now() - lastFetchTime >= FETCH_INTERVAL;
  } catch (error) {
    console.error('Error checking fetch status:', error);
    return false;
  }
}

export async function fetchAndStoreMonitoringData() {
  try {
    const shouldFetch = await shouldFetchData();
    if (!shouldFetch) {
      console.log('Using cached data');
      return null;
    }

    console.log('Fetching new monitoring data...');
    const response = await axios.get(`${API_BASE_URL}/api/stainfo/station_realtime`);
    
    if (!response.data?.data) {
      throw new Error('无效的响应格式');
    }

    const timestamp = Date.now();
    const records: MonitoringRecord[] = [];

    // Parse response data
    const parsedData = typeof response.data.data === 'string' 
      ? JSON.parse(response.data.data) 
      : response.data.data;

    if (!parsedData?.rows?.length) {
      throw new Error('暂无实时数据');
    }

    // Process each row
    for (const row of parsedData.rows) {
      if (!row.section || !row.monitor_time) continue;

      const record: MonitoringRecord = {
        station: row.section,
        monitor_time: new Date(parseInt(row.monitor_time)).toISOString(),
        water_temp: parseFloat(row.water_temp) || 0,
        ph: parseFloat(row.ph) || 0,
        dissolvedoxygen: parseFloat(row.dissolvedoxygen) || 0,
        codmn: parseFloat(row.codmn) || 0,
        nh3n: parseFloat(row['nh3-n']) || 0,
        tp: parseFloat(row.tp) || 0,
        tn: parseFloat(row.tn) || 0,
        quality: row.quality || '未知',
        section_status: row.section_status || '未知',
        timestamp
      };

      if (row.chlorophyll) {
        record.chlorophyll = parseFloat(row.chlorophyll);
      }
      if (row.algal_density) {
        record.algal_density = parseFloat(row.algal_density);
      }

      records.push(record);
    }

    if (records.length > 0) {
      await db.transaction('rw', db.monitoringRecords, async () => {
        await db.monitoringRecords.clear();
        await db.monitoringRecords.bulkAdd(records);
        await db.logFetch(timestamp);
      });
      console.log(`Stored ${records.length} new records`);
    }
    
    return records;
  } catch (error) {
    console.error('Error fetching and storing monitoring data:', error);
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || '获取实时数据失败，请检查网络连接或稍后重试');
    }
    throw error;
  }
}

export async function getLatestMonitoringData(station: Station): Promise<MonitoringRecord | null> {
  try {
    const record = await db.monitoringRecords
      .where('station')
      .equals(station.name)
      .reverse()
      .first();
    
    return record;
  } catch (error) {
    console.error('Error getting latest monitoring data:', error);
    throw error;
  }
}

export async function getWaterQualityData(station: Station): Promise<WaterQualityData[]> {
  try {
    const response = await fetch(`/001-${station.name}.csv`);
    if (!response.ok) {
      throw new Error(`Failed to load data for station ${station.name}`);
    }
    
    const text = await response.text();
    return text
      .split('\n')
      .slice(1)
      .filter(line => line.trim())
      .map(line => {
        const [
          date,
          temperature,
          pH,
          oxygen,
          permanganate,
          NH,
          TP,
          TN,
          conductivity,
          turbidity,
          chla,
          density
        ] = line.split(',');

        return {
          date,
          temperature: parseFloat(temperature) || 0,
          pH: parseFloat(pH) || 0,
          oxygen: parseFloat(oxygen) || 0,
          permanganate: parseFloat(permanganate) || 0,
          NH: parseFloat(NH) || 0,
          TP: parseFloat(TP) || 0,
          TN: parseFloat(TN) || 0,
          conductivity: parseFloat(conductivity) || 0,
          turbidity: parseFloat(turbidity) || 0,
          chla: parseFloat(chla) || 0,
          density: parseFloat(density) || 0
        };
      });
  } catch (error) {
    console.error('Error loading water quality data:', error);
    return [];
  }
}