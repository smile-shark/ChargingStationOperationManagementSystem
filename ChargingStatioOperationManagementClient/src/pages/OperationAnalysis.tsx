import { useState } from 'react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { LineChart, BarChart, PieChart, ResponsiveContainer, Line, Bar, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import * as XLSX from 'xlsx';

const mockOperationData = [
  { month: '1月', income: 42000, users: 128, utilization: 65 },
  { month: '2月', income: 38000, users: 110, utilization: 60 },
  { month: '3月', income: 45000, users: 145, utilization: 72 },
  { month: '4月', income: 52000, users: 160, utilization: 68 },
  { month: '5月', income: 48000, users: 150, utilization: 70 },
  { month: '6月', income: 55000, users: 180, utilization: 75 },
];

export default function OperationAnalysis() {
  const [activeTab, setActiveTab] = useState<'income' | 'users' | 'utilization'>('income');

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(mockOperationData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "运营数据");
    XLSX.writeFile(wb, "运营分析报表.xlsx");
    toast.success('导出成功');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">运营分析</h1>
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          导出Excel
        </button>
      </div>

      <div className="flex space-x-4">
        {['income', 'users', 'utilization'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={cn(
              'px-4 py-2 rounded-lg',
              activeTab === tab
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            )}
          >
            {tab === 'income' ? '收益' : tab === 'users' ? '用户数' : '利用率'}
          </button>
        ))}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            {activeTab === 'income' ? (
              <LineChart data={mockOperationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="income" stroke="#1890FF" strokeWidth={2} />
              </LineChart>
            ) : activeTab === 'users' ? (
              <BarChart data={mockOperationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip />
                <Legend />
                <Bar dataKey="users" fill="#8884d8" />
              </BarChart>
            ) : (
              <PieChart>
                <Pie
                  data={mockOperationData}
                  dataKey="utilization"
                  nameKey="month"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#82ca9d"
                  label
                />
                <Tooltip />
                <Legend />
              </PieChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
