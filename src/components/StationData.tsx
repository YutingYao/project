import React from 'react';
import { RealTimeData } from './RealTimeData';
import { HistoricalData } from './HistoricalData';
import { Station } from '../data/stationData';

interface StationDataProps {
  selectedStation: Station;
}

export function StationData({ selectedStation }: StationDataProps) {
  const [activeTab, setActiveTab] = React.useState<'realtime' | 'historical'>('realtime');

  return (
    <div className="space-y-4">
      <div className="flex space-x-2 bg-white/10 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('realtime')}
          className={`flex-1 px-4 py-2 rounded-md transition-colors ${
            activeTab === 'realtime' 
              ? 'bg-blue-600 text-white' 
              : 'text-blue-200 hover:bg-white/10'
          }`}
        >
          实时数据
        </button>
        <button
          onClick={() => setActiveTab('historical')}
          className={`flex-1 px-4 py-2 rounded-md transition-colors ${
            activeTab === 'historical' 
              ? 'bg-blue-600 text-white' 
              : 'text-blue-200 hover:bg-white/10'
          }`}
        >
          历史数据
        </button>
      </div>

      <div className="mt-4">
        {activeTab === 'realtime' ? (
          <RealTimeData station={selectedStation} />
        ) : (
          <HistoricalData station={selectedStation} />
        )}
      </div>
    </div>
  );
}