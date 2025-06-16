import { useState } from 'react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { mockTransactions } from '@/lib/mockData';
import * as XLSX from 'xlsx';
import { Pagination } from '@/components/Pagination';

export default function TransactionFlow() {
  const [transactions, setTransactions] = useState(mockTransactions);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredTransactions = transactions.filter(tx => 
    tx.orderNo.includes(searchTerm) || 
    tx.customer.includes(searchTerm) ||
    tx.phone.includes(searchTerm) ||
    tx.pileNo.includes(searchTerm)
  );

  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  const getStatusColor = (status: string) => {
    return status === 'completed' ? 'bg-green-500' : 'bg-yellow-500';
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
    switch(type) {
      case 'charge': return '充电消费';
      case 'recharge': return '账户充值';
      case 'refund': return '退款';
      default: return type;
    }
  };

  const handleExport = () => {
    const dataToExport = filteredTransactions.map(tx => ({
      订单号: tx.orderNo,
      客户名称: tx.customer,
      联系电话: tx.phone,
      交易类型: getTypeName(tx.type),
      支付方式: getPaymentMethodName(tx.paymentMethod),
      所在充电站: tx.station || '-',
      金额: tx.amount,
      充电桩编号: tx.pileNo || '-',
      状态: tx.status === 'completed' ? '已完成' : '待支付'
    }));
    
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "交易流水");
    XLSX.writeFile(wb, "交易流水.xlsx");
    toast.success('导出成功');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">交易流水</h1>
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">交易类型</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">支付方式</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">所在充电站</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">金额</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">充电桩编号</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedTransactions.map(tx => (
              <tr key={tx.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{tx.orderNo}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tx.customer}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tx.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getTypeName(tx.type)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getPaymentMethodName(tx.paymentMethod)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tx.station || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">¥{tx.amount}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tx.pileNo || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(tx.status)} text-white`}>
                    {tx.status === 'completed' ? '已完成' : '待支付'}
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