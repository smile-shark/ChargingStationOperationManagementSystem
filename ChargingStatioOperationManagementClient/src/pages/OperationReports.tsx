import { useState } from 'react';
import { 
  LineChart, Line, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ComposedChart, Area
} from 'recharts';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// Mock数据
const incomeData = [
  { date: '1月', income: 42000 },
  { date: '2月', income: 38000 },
  { date: '3月', income: 45000 },
  { date: '4月', income: 52000 },
  { date: '5月', income: 48000 },
  { date: '6月', income: 55000 },
];

const utilizationData = [
  { date: '1月', used: 120, total: 200 },
  { date: '2月', used: 150, total: 200 },
  { date: '3月', used: 180, total: 200 },
  { date: '4月', used: 160, total: 200 },
  { date: '5月', used: 190, total: 200 },
  { date: '6月', used: 170, total: 200 },
];

const stationComparisonData = [
  { subject: '朝阳站', A: 120, B: 110, fullMark: 150 },
  { subject: '浦东站', A: 98, B: 130, fullMark: 150 },
  { subject: '天河站', A: 86, B: 130, fullMark: 150 },
  { subject: '南山站', A: 99, B: 100, fullMark: 150 },
  { subject: '高新站', A: 85, B: 90, fullMark: 150 },
];

export default function OperationReports() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleExport = () => {
    toast.success('数据导出成功');
  };

  // 计算利用率百分比
  const utilizationWithPercentage = utilizationData.map(item => ({
    ...item,
    utilization: (item.used / item.total * 100).toFixed(1) + '%'
  }));

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">运营分析报表</h1>
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          导出数据
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 收益趋势折线图 */}
        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
          <h2 className="text-xl font-semibold mb-4">收益趋势</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={incomeData}
                onMouseMove={(e) => {
                  if (e.activeTooltipIndex !== undefined) {
                    setActiveIndex(e.activeTooltipIndex);
                  }
                }}
                onMouseLeave={() => setActiveIndex(null)}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Area type="monotone" dataKey="income" fill="#1890FF" fillOpacity={0.1} />
                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="#1890FF"
                  strokeWidth={2}
                  activeDot={{ r: 6 }}
                  dot={{ r: activeIndex === null ? 4 : (idx: number) => idx === activeIndex ? 6 : 4 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 利用率堆叠柱状图 */}
        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
          <h2 className="text-xl font-semibold mb-4">设备利用率</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={utilizationWithPercentage}
                onMouseMove={(e) => {
                  if (e.activeTooltipIndex !== undefined) {
                    setActiveIndex(e.activeTooltipIndex);
                  }
                }}
                onMouseLeave={() => setActiveIndex(null)}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Legend />
                <Bar 
                  dataKey="used" 
                  stackId="a" 
                  fill="#1890FF" 
                  name="已使用" 
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="total" 
                  stackId="a" 
                  fill="#e6f7ff" 
                  name="总量" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 站点对比雷达图 */}
        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">站点对比分析</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={stationComparisonData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" stroke="#888" />
                <PolarRadiusAxis angle={30} domain={[0, 150]} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Radar
                  name="充电量"
                  dataKey="A"
                  stroke="#1890FF"
                  fill="#1890FF"
                  fillOpacity={0.6}
                />
                <Radar
                  name="收益"
                  dataKey="B"
                  stroke="#52c41a"
                  fill="#52c41a"
                  fillOpacity={0.6}
                />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}