import axios from 'axios';
import { Station } from '../data/stationData';

export interface RealTimeData {
  station: string;
  monitor_time: string;
  water_temp: number;
  ph: number;
  dissolvedoxygen: number;
  codmn: number;
  'nh3-n': number;
  tp: number;
  tn: number;
  chlorophyll?: number;
  algal_density?: number;
  quality: string;
  section_status: string;
}

export interface APIError {
  code: string;
  message: string;
  description: string;
}

const ERROR_CODES: Record<string, { message: string; description: string }> = {
  '1108110301': {
    message: '参数校验错误',
    description: '检查参数'
  },
  '1108110304': {
    message: '参数校验错误',
    description: '检查参数取值'
  },
  '1108110519': {
    message: 'API必填参数缺失',
    description: '检查是否缺少必选参数'
  },
  '1108110525': {
    message: '获取API信息失败',
    description: '检查API配置'
  },
  '1108110565': {
    message: 'API SQL执行错误',
    description: '检查API SQL配置'
  },
  '1108110602': {
    message: '获取API关联数据源信息失败',
    description: '检查API配置'
  }
};

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

export async function getRealTimeData(station: Station): Promise<RealTimeData | null> {
  try {
    console.log('Fetching data for station:', station.name);
    
    const response = await axiosInstance.get('/api/stainfo/station_realtime', {
      params: {
        pageNum: 1,
        pageSize: 1000,
        returnTotalNum: true,
        province: '江苏省',
        city: '无锡市',
        section: station.name
      }
    });

    if (!response.data?.data) {
      console.warn('Invalid response format:', response.data);
      throw new Error('服务器返回数据格式错误');
    }

    const parsedData = typeof response.data.data === 'string' 
      ? JSON.parse(response.data.data) 
      : response.data.data;
    
    if (!parsedData?.rows?.length) {
      console.warn(`No data found for station: ${station.name}`);
      return null;
    }

    const stationData = parsedData.rows[0];

    const parseNumber = (value: string | number | null | undefined): number => {
      if (value === null || value === undefined || value === '') return 0;
      const num = typeof value === 'string' ? parseFloat(value) : value;
      return isNaN(num) ? 0 : num;
    };

    return {
      station: stationData.section,
      monitor_time: new Date(parseInt(stationData.monitor_time)).toISOString(),
      water_temp: parseNumber(stationData.water_temp),
      ph: parseNumber(stationData.ph),
      dissolvedoxygen: parseNumber(stationData.dissolvedoxygen),
      codmn: parseNumber(stationData.codmn),
      'nh3-n': parseNumber(stationData['nh3-n']),
      tp: parseNumber(stationData.tp),
      tn: parseNumber(stationData.tn),
      chlorophyll: stationData.chlorophyll ? parseNumber(stationData.chlorophyll) : undefined,
      algal_density: stationData.algal_density ? parseNumber(stationData.algal_density) : undefined,
      quality: stationData.quality || '未知',
      section_status: stationData.section_status || '未知'
    };
  } catch (error) {
    console.error('Error fetching real-time data:', error);
    
    if (axios.isAxiosError(error) && error.response?.data) {
      const errorCode = error.response.data.code;
      if (errorCode && ERROR_CODES[errorCode]) {
        throw {
          code: errorCode,
          message: ERROR_CODES[errorCode].message,
          description: ERROR_CODES[errorCode].description
        } as APIError;
      }
    }
    
    throw new Error('获取实时数据失败，请检查网络连接或稍后重试');
  }
}</content>