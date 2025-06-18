import React,{useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { mockPileStatus } from '@/lib/mockData';
import { ChargingPile } from '@/types';
import api from '@/api';


interface StatusCardProps {
  title: string;
  count: number;
  color: string;
  icon: string;
}

function StatusCard({ title, count, color, icon }: StatusCardProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="flex items-center">
        <div className={`w-12 h-12 rounded-full ${color} flex items-center justify-center mr-4`}>
          <i className={`fas fa-${icon} text-white text-xl`}></i>
        </div>
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <p className="text-2xl font-bold">{count}</p>
        </div>
      </div>
    </div>
  );
}

export default function StationStatus() {
  const { id } = useParams();
  const navigate = useNavigate();
  const piles = mockPileStatus[id as keyof typeof mockPileStatus] || [];
  const [chargingPileList,setChargingPileList] = useState<ChargingPile[]>([]);
  
  // 获取充电桩列表
  


  // 统计各状态数量
  const statusCounts = {
    charging: piles.filter(p => p.status === 'charging').length,
    idle: piles.filter(p => p.status === 'idle').length,
    offline: piles.filter(p => p.status === 'offline').length,
    fault: piles.filter(p => p.status === 'fault').length,
    total: piles.length
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'charging': return 'bg-blue-500';
      case 'idle': return 'bg-green-500';
      case 'offline': return 'bg-gray-500';
      case 'fault': return 'bg-red-500';
      default: return 'bg-gray-300';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">充电站设备状态</h1>
        <button
          onClick={() => navigate('/monitor')}
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          <i className="fas fa-arrow-left mr-2"></i>返回实时监控
        </button>
      </div>
      
      {/* 状态统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatusCard 
          title="充电中" 
          count={statusCounts.charging} 
          color="bg-blue-500" 
          icon="bolt" 
        />
        <StatusCard 
          title="空闲" 
          count={statusCounts.idle} 
          color="bg-green-500" 
          icon="battery-full" 
        />
        <StatusCard 
          title="离线" 
          count={statusCounts.offline} 
          color="bg-gray-500" 
          icon="plug" 
        />
        <StatusCard 
          title="故障" 
          count={statusCounts.fault} 
          color="bg-red-500" 
          icon="exclamation-triangle" 
        />
        <StatusCard 
          title="总计" 
          count={statusCounts.total} 
          color="bg-purple-500" 
          icon="charging-station" 
        />
      </div>

      {/* 充电桩列表 */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">充电桩编号</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">功率(kW)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {piles.map(pile => (
              <tr key={pile.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{pile.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pile.power}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(pile.status)} text-white`}>
                    {pile.status === 'charging' ? '充电中' : 
                     pile.status === 'idle' ? '空闲' : 
                     pile.status === 'offline' ? '离线' : '故障'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}