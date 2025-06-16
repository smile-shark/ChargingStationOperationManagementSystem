import { useState } from 'react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { LineChart, ResponsiveContainer, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import * as XLSX from 'xlsx';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const mockEnergyData = [
  { 
    pile: 'P001', 
    station: '朝阳站',
    data: [
      { month: '1月', consumption: 1250 },
      { month: '2月', consumption: 1180 },
      { month: '3月', consumption: 1420 },
      { month: '4月', consumption: 1360 },
      { month: '5月', consumption: 1480 },
      { month: '6月', consumption: 1550 },
    ]
  },
  { 
    pile: 'P002', 
    station: '朝阳站',
    data: [
      { month: '1月', consumption: 980 },
      { month: '2月', consumption: 920 },
      { month: '3月', consumption: 1050 },
      { month: '4月', consumption: 1100 },
      { month: '5月', consumption: 1150 },
      { month: '6月', consumption: 1250 },
    ]
  },
];

export default function EnergyConsumption() {
  const [selectedPile, setSelectedPile] = useState<string>('all');
  const [startDate, setStartDate] = useState<Date | null>(new Date(2025, 0, 1));
  const [endDate, setEndDate] = useState<Date | null>(new Date(2025, 5, 30));

  const handleExport = () => {
    const dataToExport = mockEnergyData.flatMap(item => 
      item.data.map(d => ({
        充电桩: item.pile,
        充电站: item.station,
        月份: d.month,
        耗电量: d.consumption
      }))
    );
    
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "能耗数据");
    XLSX.writeFile(wb, "能耗报表.xlsx");
    toast.success('导出成功');
  };

  const filteredData = mockEnergyData
    .filter(item => selectedPile === 'all' || item.pile === selectedPile)
    .flatMap(item => item.data);

  // 获取表格数据


  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">能耗报表</h1>
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          导出Excel
        </button>
      </div>

      <div className="flex flex-wrap gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">充电桩</label>
          <select
            value={selectedPile}
            onChange={(e) => setSelectedPile(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">全部充电桩</option>
            {mockEnergyData.map(item => (
              <option key={item.pile} value={item.pile}>{item.pile} - {item.station}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">开始月份</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            dateFormat="yyyy-MM"
            showMonthYearPicker
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">结束月份</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            dateFormat="yyyy-MM"
            showMonthYearPicker
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="consumption" stroke="#8884d8" strokeWidth={2} name="耗电量(kWh)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 新增表格区域 */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">归属充电站</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">充电桩</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">月份</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">耗电量(kWh)</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
             {mockEnergyData.map((item, index) => (
               <tr key={index} className="hover:bg-gray-50">
                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.pile}</td>
                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.station}</td>
                 {item.data.map((monthData, i) => (
                   <td key={i} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{monthData.consumption}</td>
                 ))}
               </tr>
             ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
