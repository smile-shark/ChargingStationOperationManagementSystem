import { useState } from 'react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { BarChart, ResponsiveContainer, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import * as XLSX from 'xlsx';

interface FaultDetail {
  id: string;
  station: string;
  pile: string;
  type: string;
  level: 'critical' | 'warning' | 'normal';
  time: string;
  description: string;
  status: 'pending' | 'processing' | 'resolved';
  operator: string;
}

const mockFaultData = [
  { station: '朝阳站', critical: 5, warning: 12, normal: 3 },
  { station: '浦东站', critical: 3, warning: 8, normal: 2 },
  { station: '天河站', critical: 7, warning: 15, normal: 4 },
  { station: '南山站', critical: 2, warning: 6, normal: 1 },
  { station: '高新站', critical: 4, warning: 9, normal: 3 },
];

const mockFaultDetails: FaultDetail[] = [
  {
    id: '1',
    station: '朝阳站',
    pile: 'P001',
    type: '温度过高',
    level: 'critical',
    time: '2025-06-14 10:30:25',
    description: '充电枪温度超过80°C，请立即处理',
    status: 'processing',
    operator: '张三'
  },
  {
    id: '2',
    station: '浦东站',
    pile: 'P002',
    type: '电压异常',
    level: 'warning',
    time: '2025-06-14 11:15:10',
    description: 'A相电压超过250V',
    status: 'pending',
    operator: '李四'
  },
  {
    id: '3',
    station: '天河站',
    pile: 'P003',
    type: '绝缘故障',
    level: 'normal',
    time: '2025-06-14 09:45:30',
    description: '绝缘电阻低于0.5MΩ',
    status: 'resolved',
    operator: '王五'
  }
];

export default function FaultAnalysis() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('month');
  const [activeTab, setActiveTab] = useState<'chart' | 'table'>('chart');

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(mockFaultDetails);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "故障详情");
    XLSX.writeFile(wb, "故障详情.xlsx");
    toast.success('导出成功');
  };

  const getLevelColor = (level: string) => {
    switch(level) {
      case 'critical': return 'bg-red-500';
      case 'warning': return 'bg-yellow-500';
      case 'normal': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-red-100 text-red-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
     <div className="p-6 space-y-6">
       <div className="flex justify-between items-center">
         <h1 className="text-2xl font-bold">故障分析</h1>
         <div className="flex space-x-4">
           <select
             value={timeRange}
             onChange={(e) => setTimeRange(e.target.value as any)}
             className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
           >
             <option value="week">本周</option>
             <option value="month">本月</option>
             <option value="quarter">本季度</option>
           </select>
           <button
             onClick={handleExport}
             className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
           >
             导出Excel
           </button>
         </div>
       </div>

       <div className="bg-white p-6 rounded-xl shadow-sm">
         <div className="h-96">
           <ResponsiveContainer width="100%" height="100%">
             <BarChart data={mockFaultData}>
               <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
               <XAxis dataKey="station" stroke="#888" />
               <YAxis stroke="#888" />
               <Tooltip />
               <Legend />
               <Bar dataKey="critical" stackId="a" fill="#ff4d4f" name="严重故障" />
               <Bar dataKey="warning" stackId="a" fill="#faad14" name="一般告警" />
               <Bar dataKey="normal" stackId="a" fill="#52c41a" name="普通通知" />
             </BarChart>
           </ResponsiveContainer>
         </div>
       </div>

       <div className="bg-white rounded-lg shadow-sm overflow-hidden">
         <table className="min-w-full divide-y divide-gray-200">
           <thead className="bg-gray-50">
             <tr>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">充电站</th>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">充电桩</th>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">故障类型</th>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">严重程度</th>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">发生时间</th>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">故障描述</th>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">处理状态</th>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">处理人</th>
             </tr>
           </thead>
           <tbody className="bg-white divide-y divide-gray-200">
             {mockFaultDetails.map(fault => (
               <tr key={fault.id} className="hover:bg-gray-50">
                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{fault.station}</td>
                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{fault.pile}</td>
                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{fault.type}</td>
                 <td className="px-6 py-4 whitespace-nowrap">
                   <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getLevelColor(fault.level)} text-white`}>
                     {fault.level === 'critical' ? '严重' : fault.level === 'warning' ? '警告' : '一般'}
                   </span>
                 </td>
                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{fault.time}</td>
                 <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">{fault.description}</td>
                 <td className="px-6 py-4 whitespace-nowrap">
                   <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(fault.status)}`}>
                     {fault.status === 'pending' ? '待处理' : fault.status === 'processing' ? '处理中' : '已解决'}
                   </span>
                 </td>
                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{fault.operator}</td>
               </tr>
             ))}
           </tbody>
         </table>
       </div>
    </div>
  );
}
