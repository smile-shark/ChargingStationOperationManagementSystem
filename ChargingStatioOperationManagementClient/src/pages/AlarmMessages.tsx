import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Pagination } from '@/components/Pagination';
import { mockAlarmMessages } from '@/lib/mockData';


interface AlarmMessage {
  id: string;
  pileName: string;
  stationName: string;
  type: string;
  level: 'normal' | 'urgent' | 'critical';
  time: string;
  details: string;
  status: 'unread' | 'read' | 'processed';
}

export default function AlarmMessages() {
  // Mock数据
  const [messages, setMessages] = useState<AlarmMessage[]>([
    {
      id: '1',
      pileName: '直流快充桩1',
      stationName: '北京朝阳充电站',
      type: '温度过高',
      level: 'critical',
      time: '2025-06-14 10:30:25',
      details: '充电枪温度超过80°C，请立即处理',
      status: 'unread'
    },
    {
      id: '2',
      pileName: '交流慢充桩2',
      stationName: '上海浦东充电站',
      type: '电压异常',
      level: 'urgent',
      time: '2025-06-14 11:15:10',
      details: 'A相电压超过250V',
      status: 'read'
    },
    {
      id: '3',
      pileName: '电瓶车充电桩3',
      stationName: '广州天河充电站',
      type: '绝缘故障',
      level: 'normal',
      time: '2025-06-14 09:45:30',
      details: '绝缘电阻低于0.5MΩ',
      status: 'processed'
    },
    ...mockAlarmMessages
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredMessages = messages.filter(msg => 
    msg.pileName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    msg.stationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedMessages = filteredMessages.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredMessages.length / itemsPerPage);

  const getLevelColor = (level: string) => {
    switch(level) {
      case 'critical': return 'bg-red-500';
      case 'urgent': return 'bg-yellow-500';
      case 'normal': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'unread': return 'bg-red-100 text-red-800';
      case 'read': return 'bg-blue-100 text-blue-800';
      case 'processed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusChange = (id: string, status: 'unread' | 'read' | 'processed') => {
    setMessages(messages.map(msg => 
      msg.id === id ? {...msg, status} : msg
    ));
    toast.success('状态已更新');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">报警消息</h1>
        <input
          type="text"
          placeholder="搜索充电桩、充电站或报警类型..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">充电桩名称</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">归属充电站</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">报警类型</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">等级程度</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">报警时间</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">警报详情</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
             {paginatedMessages.map(msg => (
               <tr key={msg.id} className="hover:bg-gray-50">
                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{msg.pileName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{msg.stationName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{msg.type}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getLevelColor(msg.level)} text-white`}>
                    {msg.level === 'critical' ? '严重' : msg.level === 'urgent' ? '紧急' : '一般'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{msg.time}</td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">{msg.details}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(msg.status)}`}>
                    {msg.status === 'unread' ? '未读' : msg.status === 'read' ? '已读' : '已处理'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-2">
                  <select
                    value={msg.status}
                    onChange={(e) => handleStatusChange(msg.id, e.target.value as any)}
                    className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="unread">未读</option>
                    <option value="read">已读</option>
                    <option value="processed">已处理</option>
                  </select>
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
