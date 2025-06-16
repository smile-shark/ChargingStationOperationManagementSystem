import { useState } from 'react';
import { Card } from '@/components/Card';
import { LineChart } from '@/components/LineChart';
import { mockCoreData, mockCustomerGrowth, mockTrendData } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import {
  ResponsiveContainer,
  ComposedChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  Line
} from 'recharts';


export default function Home() {
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month' | 'year'>('day');
  
  const coreData = mockCoreData[timeRange];
  const customerData = mockCustomerGrowth[timeRange];
  const trendData = mockTrendData[timeRange];

  return (
    <div className="p-6 space-y-6">
      {/* 时间选择器 */}
      <div className="flex space-x-4">
        {['day', 'week', 'month', 'year'].map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range as 'day' | 'week' | 'month' | 'year')}
            className={cn(
              'px-4 py-2 rounded-lg',
              timeRange === range 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 hover:bg-gray-200'
            )}
          >
            {range === 'day' ? '日' : range === 'week' ? '周' : range === 'month' ? '月' : '年'}
          </button>
        ))}
      </div>

      {/* 核心指标卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coreData.map((item, index) => (
          <Card key={index} title={item.title} value={item.value} growth={item.growth} />
        ))}
      </div>

      {/* 趋势分析图表 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
          <h2 className="text-xl font-semibold mb-4">充电金额趋势</h2>
          <div className="h-64">
            <LineChart 
              data={trendData} 
              dataKey="amount"
              unit="元"
              name="金额"
            />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
          <h2 className="text-xl font-semibold mb-4">充电电量趋势</h2>
          <div className="h-64">
            <LineChart 
              data={trendData} 
              dataKey="power"
              unit="kWh"
              name="电量"
            />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
          <h2 className="text-xl font-semibold mb-4">充电次数趋势</h2>
          <div className="h-64">
            <LineChart 
              data={trendData} 
              dataKey="count"
              unit="次"
              name="次数"
            />
          </div>
        </div>
      </div>

      {/* 客户增长图表 */}
      <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
        <h2 className="text-xl font-semibold mb-4">新增客户环比分析</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={customerData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" stroke="#888" />
              <YAxis yAxisId="left" stroke="#888" />
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                stroke="#FF8C00"
                domain={['auto', 'auto']}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#fff',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
                formatter={(value: number, name: string) => {
                  const unit = name === 'count' ? '人' : '%';
                  return [`${value}${unit}`, name === 'count' ? '新增用户' : '环比增长'];
                }}
              />
              <Legend />
              <Bar 
                yAxisId="left"
                dataKey="count" 
                name="新增用户"
                fill="#1890FF" 
                radius={[4, 4, 0, 0]}
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="growth" 
                name="环比增长"
                stroke="#FF8C00" 
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}