import React from 'react';
import { WaterQualityChart } from './WaterQualityChart';
import { Station } from '../data/stationData';
import { useWaterQualityData } from '../hooks/useWaterQualityData';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/Tabs';

interface HistoricalDataProps {
  station: Station;
}

export function HistoricalData({ station }: HistoricalDataProps) {
  const { data, loading, error } = useWaterQualityData(station);

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-white/20 rounded w-64"></div>
          <div className="h-[300px] bg-white/10 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
        <div className="text-red-400">获取历史数据失败</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="water-quality">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="water-quality">水质参数</TabsTrigger>
          <TabsTrigger value="nutrients">营养盐指标</TabsTrigger>
          <TabsTrigger value="algae">藻类指标</TabsTrigger>
        </TabsList>
        
        <TabsContent value="water-quality">
          <WaterQualityChart 
            data={data}
            selectedStation={station}
            type="water-quality"
            title="水质参数历史趋势"
            parameters={['temperature', 'pH', 'oxygen']}
            labels={['温度', 'pH', '溶解氧']}
          />
        </TabsContent>

        <TabsContent value="nutrients">
          <WaterQualityChart 
            data={data}
            selectedStation={station}
            type="nutrients"
            title="营养盐指标历史趋势"
            parameters={['NH', 'TP', 'TN', 'permanganate']}
            labels={['氨氮', '总磷', '总氮', '高锰酸盐']}
          />
        </TabsContent>

        <TabsContent value="algae">
          <WaterQualityChart 
            data={data}
            selectedStation={station}
            type="algae"
            title="藻类指标历史趋势"
            parameters={['chla', 'density']}
            labels={['叶绿素a', '藻密度']}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}