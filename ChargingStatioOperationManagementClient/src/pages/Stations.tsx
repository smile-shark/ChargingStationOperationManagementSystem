import { useState, useEffect } from 'react';
import api from '@/api';
import path from '@/api/path';
import { Pagination } from '@/components/Pagination';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

import { ChargingStation as IChargingStation, ChargingPile as IChargingPile } from '@/types';

interface Station extends Omit<IChargingStation, 'chargingStationId' | 'operationsPersonnelId' | 'type' | 'state'> {
  id: string;
  type: 'mixed-small' | 'mixed-medium' | 'mixed-large' | 
        'car-small' | 'car-medium' | 'car-large' |
        'bike-small' | 'bike-medium' | 'bike-large';
  status: 'active' | 'inactive';
  lng: number;
  lat: number;
  carPiles: number;
  bikePiles: number;
  busPiles: number;
}

interface Pile extends Omit<IChargingPile, 'chargingPileId' | 'chargingStationId' | 'state'> {
  id: string;
  stationId: string;
  status: 'available' | 'charging' | 'maintenance';
}

// 充电站类型映射
const stationTypeMap = {
  0: 'mixed-small',
  1: 'mixed-medium',
  2: 'mixed-large',
  3: 'car-small',
  4: 'car-medium',
  5: 'car-large',
  6: 'bike-small',
  7: 'bike-medium',
  8: 'bike-large'
} as const;

// 充电站类型反向映射
const stationTypeReverseMap = {
  'mixed-small': 0,
  'mixed-medium': 1,
  'mixed-large': 2,
  'car-small': 3,
  'car-medium': 4,
  'car-large': 5,
  'bike-small': 6,
  'bike-medium': 7,
  'bike-large': 8
} as const;

export default function Stations() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const itemsPerPage = 10;
  const [stations, setStations] = useState<Station[]>([]);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        // const response = await axios.get(path.chargingStation.list, {
        //   params: {
        //     page: currentPage,
        //     size: itemsPerPage
        //   }
        // });
        const response=await api.chargingStation_list(
          currentPage,
          itemsPerPage
        )

        if (response.data.code === 200) {
          const { records, total, pages } = response.data.data;
          setTotal(total);
          setTotalPages(pages);
          
          // 转换数据结构
          const mappedStations = records.map((station: IChargingStation) => ({
            id: station.chargingStationId,
            name: station.name,
            type: stationTypeMap[station.type as keyof typeof stationTypeMap] || 'mixed-medium',
            address: station.address,
            status: station.state === 1 ? 'active' : 'inactive',
            lng: station.x,
            lat: station.y,
            startTime: station.startTime,
            endTime: station.endTime,
            picture: station.picture,
            detail: station.detail,
            carPiles: station.carPileCount,
            bikePiles: station.esPileCount,
            busPiles: station.busPileCount
          }));
          
          setStations(mappedStations);
        }
      } catch (error) {
        console.error('Failed to fetch stations:', error);
        toast.error('获取充电站列表失败');
      }
    };

    fetchStations();
  }, [currentPage, itemsPerPage]);

  const [piles] = useState<Pile[]>([
    { id: '1', stationId: '1', name: '朝阳站桩1', status: 'available' },
    { id: '2', stationId: '1', name: '朝阳站桩2', status: 'charging' },
    { id: '3', stationId: '2', name: '浦东站桩1', status: 'available' },
  ]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [currentStation, setCurrentStation] = useState<Station | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const handleAdd = () => {
    setCurrentStation(null);
    setIsFormOpen(true);
  };

  const handleEdit = (station: Station) => {
    setCurrentStation(station);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await api.chargingStation_delete(id);
      if (response.data.code === 200) {
        setStations(stations.filter(station => station.id !== id));
        toast.success('删除成功');
      } else {
        toast.error(response.data.msg || '删除失败');
      }
    } catch (error) {
      console.error('Failed to delete station:', error);
      toast.error('删除失败');
    }
  };

  const handleSubmit = async (formData: FormData) => {
    try {
      // 获取表单中选择的类型
      const stationType = formData.get('stationType') as keyof typeof stationTypeReverseMap || 'mixed-medium';
      
      const stationData = {
        name: formData.get('name') as string,
        type: stationTypeReverseMap[stationType], // 使用类型映射
        address: formData.get('address') as string,
        state: formData.get('status') === 'active' ? 1 : 0,
        x: currentStation?.lng || 0,
        y: currentStation?.lat || 0,
        startTime: formData.get('operationTime')?.toString().split('-')[0].trim() + ':00' || '00:00:00',
        endTime: formData.get('operationTime')?.toString().split('-')[1].trim() + ':00' || '00:00:00',
        picture: formData.get('picture') as string || '',
        detail: formData.get('description') as string || '',
        carPileCount: parseInt(formData.get('carPiles') as string) || 0,
        esPileCount: parseInt(formData.get('bikePiles') as string) || 0,
        busPileCount: parseInt(formData.get('busPiles') as string) || 0
      };

      let response;
      if (currentStation) {
        response = await api.chargingStation_update(currentStation.id, stationData);
      } else {
        response = await api.chargingStation_add(stationData);
      }

      if (response.data.code === 200) {
        setIsFormOpen(false);
        toast.success(currentStation ? '更新成功' : '添加成功');
        // 刷新列表
        const listResponse = await api.chargingStation_list(currentPage, itemsPerPage);
        if (listResponse.data.code === 200) {
          const { records, total, pages } = listResponse.data.data;
          setTotal(total);
          setTotalPages(pages);
          setStations(records.map((station: any) => ({
            id: station.chargingStationId,
            name: station.name,
            type: 'mixed-medium',
            address: station.address,
            status: station.state === 1 ? 'active' : 'inactive',
            lng: station.x,
            lat: station.y,
            startTime: station.startTime,
            endTime: station.endTime,
            picture: station.picture,
            detail: station.detail,
            carPiles: station.carPileCount,
            bikePiles: station.esPileCount,
            busPiles: station.busPileCount
          })));
        }
      } else {
        toast.error(response.data.msg || (currentStation ? '更新失败' : '添加失败'));
      }
    } catch (error) {
      console.error('Failed to submit station:', error);
      toast.error(currentStation ? '更新失败' : '添加失败');
    }
  };

  const handleGetLocation = () => {
    setIsGettingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentStation(prev => ({
            ...prev!,
            lng: position.coords.longitude,
            lat: position.coords.latitude
          }));
          setIsGettingLocation(false);
          toast.success('获取位置成功');
        },
        () => {
          setIsGettingLocation(false);
          toast.error('获取位置失败');
        }
      );
    } else {
      setIsGettingLocation(false);
      toast.error('浏览器不支持地理位置功能');
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'bg-green-500' : 'bg-gray-500';
  };

  const getPileStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500';
      case 'charging': return 'bg-blue-500';
      case 'maintenance': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">充电站管理</h1>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          新增充电站
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
             <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">编号</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">名称</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">地址</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">运营时间</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">汽车桩数</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">电瓶车桩数</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">公交车桩数</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
             {stations.map((station) => (
                <tr key={station.id} className="hover:bg-gray-50">
                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{station.id.substring(0, 8)}</td>
                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{station.name}</td>
                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{station.address}</td>
                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                   {station.startTime === "00:00:00" && station.endTime === "00:00:00" 
                     ? "24小时营业" 
                     : `${station.startTime?.substring(0, 5)} - ${station.endTime?.substring(0, 5)}`}
                 </td>
                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{station.carPiles}</td>
                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{station.bikePiles}</td>
                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{station.busPiles}</td>
                 <td className="px-6 py-4 whitespace-nowrap">
                   <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(station.status)} text-white`}>
                     {station.status === 'active' ? '运营中' : '停用中'}
                   </span>
                 </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-2">
                  <button
                    onClick={() => {
                      setCurrentStation(station);
                      setIsDetailOpen(true);
                    }}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    详情
                  </button>
                  <button
                    onClick={() => handleEdit(station)}
                    className="text-yellow-600 hover:text-yellow-900"
                  >
                    编辑
                  </button>
                  <button
                    onClick={() => handleDelete(station.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    删除
                  </button>
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
 
       {/* 表单弹窗 */}
       {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            {/* 固定的头部 */}
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold">{currentStation ? '编辑充电站' : '新增充电站'}</h2>
            </div>
            
            {/* 可滚动的内容区域 */}
            <div className="flex-1 overflow-y-auto p-6" style={{ scrollbarWidth: 'thin' }}>
              <form id="stationForm" onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const formData = new FormData(form);
                handleSubmit(formData);
              }} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* 基础与位置信息 */}
                <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                  <h3 className="font-medium text-lg">基础信息</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">充电站名称*</label>
                      <input
                        name="name"
                        type="text"
                        defaultValue={currentStation?.name || ''}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">详细地址*</label>
                      <input
                        name="address"
                        type="text"
                        defaultValue={currentStation?.address || ''}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">运营时间*</label>
                      <input
                        name="operationTime"
                        type="text"
                        defaultValue={currentStation?.startTime && currentStation?.endTime ? 
                          `${currentStation.startTime.substring(0, 5)} - ${currentStation.endTime.substring(0, 5)}` : 
                          '00:00 - 00:00'}
                        placeholder="格式：HH:MM - HH:MM"
                        pattern="([0-1][0-9]|2[0-3]):[0-5][0-9]\s*-\s*([0-1][0-9]|2[0-3]):[0-5][0-9]"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                      <p className="mt-1 text-sm text-gray-500">例如：09:00 - 21:00，24小时营业请输入：00:00 - 00:00</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">状态*</label>
                      <select
                        name="status"
                        defaultValue={currentStation?.status || 'active'}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="active">运营中</option>
                        <option value="inactive">停用中</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">详细介绍</label>
                      <textarea
                        name="description"
                        rows={3}
                        defaultValue={currentStation?.detail || ''}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div className="h-40 bg-gray-200 rounded-md flex items-center justify-center">
                    <span className="text-gray-500">地图位置选择</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleGetLocation}
                    disabled={isGettingLocation}
                    className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
                  >
                    {isGettingLocation ? '获取中...' : '获取当前位置'}
                  </button>
                  {currentStation?.lng && currentStation?.lat && (
                    <div className="text-sm text-gray-500">
                      当前坐标: {currentStation.lng.toFixed(6)}, {currentStation.lat.toFixed(6)}
                    </div>
                  )}
                </div>

                {/* 联系与运营信息 - 已合并到基础信息中 */}

                {/* 充电桩配置 */}
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <h3 className="font-medium text-lg mb-2">充电站图片</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">上传图片</label>
                    <div className="mt-1 flex items-center">
                      {currentStation?.picture && (
                        <div className="mb-2">
                          <img 
                            src={currentStation.picture} 
                            alt="充电站图片" 
                            className="h-32 w-auto object-cover rounded"
                          />
                        </div>
                      )}
                    </div>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="picture"
                        defaultValue={currentStation?.picture || ''}
                        placeholder="请输入图片URL"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                      <p className="mt-1 text-sm text-gray-500">请输入图片URL地址</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-lg mb-2">充电桩配置</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">汽车充电桩数*</label>
                      <input
                        name="carPiles"
                        type="number"
                        min="0"
                        defaultValue={currentStation?.carPiles || 0}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">电瓶车充电桩数*</label>
                      <input
                        name="bikePiles"
                        type="number"
                        min="0"
                        defaultValue={currentStation?.bikePiles || 0}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">公交车充电桩数*</label>
                      <input
                        name="busPiles"
                        type="number"
                        min="0"
                        defaultValue={currentStation?.busPiles || 0}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* 计费规则 */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-lg mb-2">计费规则</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">选择计费规则*</label>
                    <select
                      name="feeRule"
                      defaultValue={currentStation?.feeRule || ''}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">请选择计费规则</option>
                      <option value="rule1">工作日标准</option>
                      <option value="rule2">周末标准</option>
                      <option value="rule3">节假日标准</option>
                    </select>
                  </div>
                </div>
              </div>

              </form>
            </div>

            {/* 固定的底部按钮区域 */}
            <div className="border-t border-gray-200 bg-gray-50 p-6">
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 bg-white text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  form="stationForm"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  保存
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 详情弹窗 */}
      {isDetailOpen && currentStation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
            {/* 固定的头部 */}
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold">{currentStation.name} - 详情</h2>
              <button
                onClick={() => setIsDetailOpen(false)}
                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            {/* 可滚动的内容区域 */}
            <div className="flex-1 overflow-y-auto p-6" style={{ scrollbarWidth: 'thin' }}>
              <div className="space-y-4">
                {currentStation.picture && (
                  <div className="mb-4">
                    <img 
                      src={currentStation.picture} 
                      alt={currentStation.name} 
                      className="w-full h-40 object-cover rounded-lg"
                    />
                  </div>
                )}
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">地址</h3>
                  <p className="mt-1 text-sm text-gray-900">{currentStation.address}</p>
                </div>
              
                <div>
                  <h3 className="text-sm font-medium text-gray-500">运营时间</h3>
                  <p className="mt-1 text-sm text-gray-900">
                    {currentStation.startTime === "00:00:00" && currentStation.endTime === "00:00:00" 
                      ? "24小时营业" 
                      : `${currentStation.startTime?.substring(0, 5)} - ${currentStation.endTime?.substring(0, 5)}`}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">状态</h3>
                  <p className="mt-1">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(currentStation.status)} text-white`}>
                      {currentStation.status === 'active' ? '运营中' : '停用中'}
                    </span>
                  </p>
                </div>
              
                {currentStation.lng && currentStation.lat && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">坐标</h3>
                    <p className="mt-1 text-sm text-gray-900">
                      {currentStation.lng.toFixed(6)}, {currentStation.lat.toFixed(6)}
                    </p>
                  </div>
                )}
              
                <div>
                  <h3 className="text-sm font-medium text-gray-500">充电桩配置</h3>
                  <div className="mt-1 grid grid-cols-3 gap-2">
                    <div className="bg-blue-50 p-2 rounded text-center">
                      <p className="text-xs text-gray-500">汽车桩</p>
                      <p className="font-medium">{currentStation.carPiles}</p>
                    </div>
                    <div className="bg-green-50 p-2 rounded text-center">
                      <p className="text-xs text-gray-500">电瓶车桩</p>
                      <p className="font-medium">{currentStation.bikePiles}</p>
                    </div>
                    <div className="bg-yellow-50 p-2 rounded text-center">
                      <p className="text-xs text-gray-500">公交车桩</p>
                      <p className="font-medium">{currentStation.busPiles}</p>
                    </div>
                  </div>
                </div>
              
                {currentStation.detail && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">详细介绍</h3>
                    <p className="mt-1 text-sm text-gray-900">{currentStation.detail}</p>
                  </div>
                )}
              
                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">关联充电桩</h3>
                  <div className="space-y-2">
                    {piles.filter(pile => pile.stationId === currentStation.id).length > 0 ? (
                      piles.filter(pile => pile.stationId === currentStation.id).map(pile => (
                        <div key={pile.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span>{pile.name}</span>
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPileStatusColor(pile.status)} text-white`}>
                            {pile.status === 'available' ? '可用' : pile.status === 'charging' ? '充电中' : '维护中'}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">暂无充电桩</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* 固定的底部 */}
            <div className="border-t border-gray-200 bg-gray-50 p-4">
              <div className="flex justify-end">
                <button
                  onClick={() => setIsDetailOpen(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}