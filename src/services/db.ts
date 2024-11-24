import Dexie, { Table } from 'dexie';

export interface MonitoringRecord {
  id?: number;
  station: string;
  monitor_time: string;
  water_temp: number;
  ph: number;
  dissolvedoxygen: number;
  codmn: number;
  nh3n: number;
  tp: number;
  tn: number;
  chlorophyll?: number;
  algal_density?: number;
  quality: string;
  section_status: string;
  timestamp: number;
}

interface FetchLog {
  id?: number;
  timestamp: number;
}

class MonitoringDatabase extends Dexie {
  monitoringRecords!: Table<MonitoringRecord>;
  fetchLog!: Table<FetchLog>;

  constructor() {
    super('MonitoringDB');
    this.version(1).stores({
      monitoringRecords: '++id, station, monitor_time, timestamp',
      fetchLog: '++id, timestamp'
    });
  }

  async getLastFetchTime(): Promise<number | null> {
    const lastLog = await this.fetchLog
      .orderBy('timestamp')
      .reverse()
      .first();
    return lastLog?.timestamp || null;
  }

  async logFetch(timestamp: number): Promise<void> {
    await this.fetchLog.add({ timestamp });
  }

  async clearOldLogs(): Promise<void> {
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    await this.fetchLog
      .where('timestamp')
      .below(thirtyDaysAgo)
      .delete();
  }
}

export const db = new MonitoringDatabase();