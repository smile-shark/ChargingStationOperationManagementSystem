import { useState } from 'react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { BarChart, ResponsiveContainer, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import * as XLSX from 'xlsx';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const mockFinancialData = [
  { 
    date: '2025-06-01',
    prepaid: 12000,
    wechat: 8500,
    alipay: 9200,
    card: 6800,
    other: 1500,
    refund: -800
  },
  { 
    date: '2025-06-02',
    prepaid: 11000,
    wechat: 9200,
    alipay: 8800,
    card: 7200,
    other: 1800,
    refund: -1200
  },
  // 更多日期数据...
];

export default function FinancialReport() {
  const [startDate, setStartDate] = useState<Date | null>(new Date(2025, 5, 1));
  const [endDate, setEndDate] = useState<Date | null>(new Date(2025, 5, 30));

  const handleExport = () => {
    const dataToExport = mockFinancialData.map(item => ({
      日期: item.date,
      预付费: item.prepaid,
      微信消费: item.wechat,
      支付宝消费: item.alipay,
      充电卡消费: item.card,
      其他消费: item.other,
      退款: item.refund,
      合计消费: item.prepaid + item.wechat + item.alipay + item.card + item.other + item.refund
    }));
    
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "财务数据");
    XLSX.writeFile(wb, "财务报表.xlsx");
    toast.success('导出成功');
  };

  const filteredData = mockFinancialData.filter(item => {
    const date = new Date(item.date);
    return (!startDate || date >= startDate) && (!endDate || date <= endDate);
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">财务报表</h1>
        <div className="flex space-x-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">开始日期</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              dateFormat="yyyy-MM-dd"
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">结束日期</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              dateFormat="yyyy-MM-dd"
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            导出Excel
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">日期</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">预付费</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">微信消费</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">支付宝消费</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">充电卡消费</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">其他消费</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">退款</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">合计</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.prepaid}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.wechat}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.alipay}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.card}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.other}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.refund}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {item.prepaid + item.wechat + item.alipay + item.card + item.other + item.refund}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip />
              <Legend />
              <Bar dataKey="prepaid" stackId="a" fill="#8884d8" name="预付费" />
              <Bar dataKey="wechat" stackId="a" fill="#82ca9d" name="微信消费" />
              <Bar dataKey="alipay" stackId="a" fill="#ffc658" name="支付宝消费" />
              <Bar dataKey="card" stackId="a" fill="#ff8042" name="充电卡消费" />
              <Bar dataKey="other" stackId="a" fill="#0088FE" name="其他消费" />
              <Bar dataKey="refund" stackId="a" fill="#ff4d4f" name="退款" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
