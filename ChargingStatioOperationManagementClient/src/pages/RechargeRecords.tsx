import { useState } from 'react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { mockRechargeRecords } from '@/lib/mockData';
import * as XLSX from 'xlsx';
import { Pagination } from '@/components/Pagination';

export default function RechargeRecords() {
  const [records, setRecords] = useState(mockRechargeRecords);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredRecords = records.filter(record => 
    record.orderNo.includes(searchTerm) || 
    record.customer.includes(searchTerm) ||
    record.phone.includes(searchTerm) ||
    (record.cardNo && record.cardNo.includes(searchTerm)) ||
    (record.account && record.account.includes(searchTerm))
  );

  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);

  const getStatusColor = (status: string) => {
    return status === 'completed' ? 'bg-green-500' : 'bg-red-500';
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

  const getTypeName = (type: string) => {
    return type === 'card' ? '充电卡充值' : '账户充值';
  };

  const handleExport = () => {
    const dataToExport = filteredRecords.map(record => ({
      订单号: record.orderNo,
      时间: record.time,
      客户名称: record.customer,
      联系电话: record.phone,
      交易类型: getTypeName(record.type),
      支付方式: getPaymentMethodName(record.paymentMethod),
      金额: record.amount,
      卡号: record.cardNo || '-',
      账号: record.account || '-',
      余额: record.balance,
      状态: record.status === 'completed' ? '成功' : '失败'
    }));
    
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "充值记录");
    XLSX.writeFile(wb, "充值记录.xlsx");
    toast.success('导出成功');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">充值记录</h1>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="搜索订单号、客户名、电话或卡号..."
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">时间</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">客户名称</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">联系电话</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">交易类型</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">支付方式</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">金额</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">卡号/账号</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">余额</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedRecords.map(record => (
              <tr key={record.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.orderNo}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.time}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.customer}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getTypeName(record.type)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getPaymentMethodName(record.paymentMethod)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">¥{record.amount}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.cardNo || record.account || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">¥{record.balance}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(record.status)} text-white`}>
                    {record.status === 'completed' ? '成功' : '失败'}
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