import { useState } from 'react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { mockChargeRecords } from '@/lib/mockData';
import * as XLSX from 'xlsx';
import { Pagination } from '@/components/Pagination';

export default function ChargeRecords() {
  const [records, setRecords] = useState(mockChargeRecords);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredRecords = records.filter(record => 
    record.orderNo.includes(searchTerm) || 
    record.customer.includes(searchTerm) ||
    record.phone.includes(searchTerm) ||
    record.pileNo.includes(searchTerm)
  );

  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);

  const getStatusColor = (status: string) => {
    return status === 'charging' ? 'bg-blue-500' : 'bg-green-500';
  };

  const getPaymentMethodName = (method: string) => {
    switch(method) {
      case 'alipay': return '支付宝';
      case 'wechat': return '微信支付';
      case 'card': return '充电卡';
      case 'cash': return '现金';
      default: return method;
    }
  };

  const getCategoryName = (category: string) => {
    switch(category) {
      case 'car': return '汽车充电';
      case 'bike': return '电瓶车充电';
      case 'bus': return '公交车充电';
      default: return category;
    }
  };

  const handleExport = () => {
    const dataToExport = filteredRecords.map(record => ({
      订单号: record.orderNo,
      客户名称: record.customer,
      联系电话: record.phone,
      充电电量: record.power,
      充电时长: record.duration,
      金额: record.amount,
      支付方式: getPaymentMethodName(record.paymentMethod),
      充电类别: getCategoryName(record.category),
      所在充电站: record.station,
      充电枪号: record.gunNo,
      状态: record.status === 'charging' ? '充电中' : '已结束'
    }));
    
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "充电记录");
    XLSX.writeFile(wb, "充电记录.xlsx");
    toast.success('导出成功');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">充电记录</h1>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="搜索订单号、客户名、电话或充电桩号..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // 搜索时重置到第一页
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">订单号</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">客户名称</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">联系电话</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">充电电量(kWh)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">充电时长(分钟)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">金额</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">支付方式</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">充电类别</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">所在充电站</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">充电枪号</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedRecords.map(record => (
               <tr key={record.id} className="hover:bg-gray-50">
                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.orderNo}</td>
                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.customer}</td>
                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.phone}</td>
                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.power}</td>
                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.duration}</td>
                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">¥{record.amount}</td>
                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getPaymentMethodName(record.paymentMethod)}</td>
                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getCategoryName(record.category)}</td>
                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.station}</td>
                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.gunNo}</td>
                 <td className="px-6 py-4 whitespace-nowrap">
                   <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(record.status)} text-white`}>
                     {record.status === 'charging' ? '充电中' : '已结束'}
                   </span>
                 </td>
               </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4">
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}