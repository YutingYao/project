import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { WaterQualityData } from '../services/monitoringService';
import { Station } from '../data/stationData';
import { Calendar, Filter } from 'lucide-react';

interface WaterQualityChartProps {
  data: WaterQualityData[];
  selectedStation: Station;
  type: 'water-quality' | 'nutrients' | 'algae';
  title: string;
  parameters: string[];
  labels: string[];
}

type TimeRange = '7d' | '1m' | '1y';

const COLORS = ['#ff7c43', '#00cc96', '#636efa', '#ef553b', '#ab63fa'];

export function WaterQualityChart({ 
  data, 
  selectedStation, 
  type,
  title,
  parameters,
  labels
}: WaterQualityChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');

  const filterData = (data: WaterQualityData[], range: TimeRange) => {
    const now = new Date(data[data.length - 1].date);
    const dates: Record<TimeRange, Date> = {
      '7d': new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      '1m': new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      '1y': new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000),
    };
    return data.filter(item => new Date(item.date) >= dates[range]);
  };

  const filteredData = filterData(data, timeRange);

  const TimeRangeButton = ({ range, label }: { range: TimeRange; label: string }) => (
    <button
      onClick={() => setTimeRange(range)}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
        timeRange === range
          ? 'bg-blue-600 text-white'
          : 'bg-white/5 text-blue-200 hover:bg-white/10'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          <h2 className="text-xl font-semibold">{selectedStation.name} - {title}</h2>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          <div className="flex gap-2">
            <TimeRangeButton range="7d" label="近7天" />
            <TimeRangeButton range="1m" label="近1月" />
            <TimeRangeButton range="1y" label="近1年" />
          </div>
        </div>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="date" stroke="#fff" />
            <YAxis stroke="#fff" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(0,0,0,0.8)',
                border: 'none',
                borderRadius: '8px',
              }}
            />
            <Legend />
            {parameters.map((param, index) => (
              <Line
                key={param}
                type="monotone"
                dataKey={param}
                stroke={COLORS[index % COLORS.length]}
                name={labels[index]}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}