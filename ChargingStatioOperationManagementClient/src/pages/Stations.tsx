import { useState } from 'react';
import { Pagination } from '@/components/Pagination';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Station {
  id: string;
  code: string;
  name: string;
  type: 'mixed-small' | 'mixed-medium' | 'mixed-large' | 
        'car-small' | 'car-medium' | 'car-large' |
        'bike-small' | 'bike-medium' | 'bike-large';
  address: string;
  contact: string;
  manager: string;
  carPiles: number;
  bikePiles: number;
  status: 'active' | 'inactive';
  lng?: number;
  lat?: number;
}

interface Pile {
  id: string;
  stationId: string;
  name: string;
  status: 'available' | 'charging' | 'maintenance';
}

export default function Stations() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [stations, setStations] = useState<Station[]>([
    { 
      id: '1', 
      code: 'CS001',
      name: '北京朝阳充电站', 
      type: 'mixed-medium',
      address: '北京市朝阳区建国路88号', 
      contact: '13800138000',
      manager: '张三',
      carPiles: 10,
      bikePiles: 5,
      status: 'active', 
      lng: 116.404, 
      lat: 39.915 
    },
    { 
      id: '2', 
      code: 'CS002',
      name: '上海浦东充电站', 
      type: 'car-large',
      address: '上海市浦东新区张江高科技园区', 
      contact: '13900139000',
      manager: '李四',
      carPiles: 20,
      bikePiles: 0,
      status: 'active' 
    },
    { 
      id: '3', 
      code: 'CS003',
      name: '广州天河充电站', 
      type: 'bike-medium',
      address: '广州市天河区体育西路', 
      contact: '13700137000',
      manager: '王五',
      carPiles: 0,
      bikePiles: 15,
      status: 'inactive' 
    },
    // 新增更多测试数据
    ...Array.from({length: 20}, (_, i) => ({
      id: `${i + 4}`,
      code: `CS${(i + 4).toString().padStart(3, '0')}`,
      name: `测试充电站${i + 4}`,
      type: ['mixed-small', 'mixed-medium', 'mixed-large', 'car-small', 'car-medium', 'car-large', 'bike-small', 'bike-medium', 'bike-large'][i % 9],
      address: `测试地址${i + 4}`,
      contact: `138${(i + 10000000).toString().slice(1)}`,
      manager: ['张三', '李四', '王五', '赵六', '钱七'][i % 5],
      carPiles: Math.floor(Math.random() * 20) + 1,
      bikePiles: Math.floor(Math.random() * 10),
      status: ['active', 'inactive'][Math.floor(Math.random() * 2)],
      lng: 116 + Math.random(),
      lat: 39 + Math.random()
    }))
  ]);

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

  const handleDelete = (id: string) => {
    setStations(stations.filter(station => station.id !== id));
    toast.success('删除成功');
  };

  const handleSubmit = (station: Station) => {
    if (currentStation) {
      setStations(stations.map(s => s.id === currentStation.id ? station : s));
    } else {
      setStations([...stations, { ...station, id: Date.now().toString() }]);
    }
    setIsFormOpen(false);
    toast.success(currentStation ? '更新成功' : '添加成功');
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">类型</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">地址</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">联系人</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">负责人</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">汽车桩数</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">电瓶车桩数</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
             {stations
               .slice(
                 (currentPage - 1) * itemsPerPage,
                 currentPage * itemsPerPage
               )
               .map((station) => (
                <tr key={station.id} className="hover:bg-gray-50">
                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{station.code}</td>
                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{station.name}</td>
                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                   {station.type === 'mixed-small' ? '混合小型充电站' :
                   station.type === 'mixed-medium' ? '混合中型充电站' :
                   station.type === 'mixed-large' ? '混合大型充电站' :
                   station.type === 'car-small' ? '小型汽车充电站' :
                   station.type === 'car-medium' ? '中型汽车充电站' :
                   station.type === 'car-large' ? '大型汽车充电站' :
                   station.type === 'bike-small' ? '小型电瓶车充电站' :
                   station.type === 'bike-medium' ? '中型电瓶车充电站' : '大型电瓶车充电站'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{station.address}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{station.contact}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{station.manager}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{station.carPiles}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{station.bikePiles}</td>
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
           totalPages={Math.ceil(stations.length / itemsPerPage)}
           onPageChange={setCurrentPage}
         />
       </div>
 
       {/* 表单弹窗 */}
       {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl">
            <h2 className="text-xl font-semibold mb-4">{currentStation ? '编辑充电站' : '新增充电站'}</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const formData = new FormData(form);
              const station = {
                id: currentStation?.id || '',
                code: formData.get('code') as string,
                name: formData.get('name') as string,
                type: formData.get('type') as any,
                address: formData.get('address') as string,
                contact: formData.get('contact') as string,
                manager: formData.get('manager') as string,
                carPiles: parseInt(formData.get('carPiles') as string),
                bikePiles: parseInt(formData.get('bikePiles') as string),
                status: formData.get('status') as 'active' | 'inactive',
                operationTime: formData.get('operationTime') as string,
                description: formData.get('description') as string,
                feeRule: formData.get('feeRule') as string,
                lng: currentStation?.lng,
                lat: currentStation?.lat,
              };
              handleSubmit(station);
            }}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* 基础与位置信息 */}
                <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                  <h3 className="font-medium text-lg">基础信息</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <label className="block text-sm font-medium text-gray-700">充电站类型*</label>
                      <select
                        name="type"
                        defaultValue={currentStation?.type || 'mixed-small'}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="mixed-small">混合小型充电站</option>
                        <option value="mixed-medium">混合中型充电站</option>
                        <option value="mixed-large">混合大型充电站</option>
                        <option value="car-small">小型汽车充电站</option>
                        <option value="car-medium">中型汽车充电站</option>
                        <option value="car-large">大型汽车充电站</option>
                        <option value="bike-small">小型电瓶车充电站</option>
                        <option value="bike-medium">中型电瓶车充电站</option>
                        <option value="bike-large">大型电瓶车充电站</option>
                      </select>
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
                      <label className="block text-sm font-medium text-gray-700">详细地址*</label>
                      <input
                        name="address"
                        type="text"
                        defaultValue={currentStation?.address || ''}
                        required
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

                {/* 联系与运营信息 */}
                <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                  <h3 className="font-medium text-lg">联系与运营</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">电站负责人*</label>
                      <input
                        name="manager"
                        type="text"
                        defaultValue={currentStation?.manager || ''}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">联系电话*</label>
                      <input
                        name="contact"
                        type="tel"
                        defaultValue={currentStation?.contact || ''}
                        required
                        pattern="[0-9]{11}"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">运营时间*</label>
                      <input
                        name="operationTime"
                        type="text"
                        defaultValue={currentStation?.operationTime || '08:00-22:00'}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">充电站图片</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <div className="flex text-sm text-gray-600">
                          <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                            <span>上传图片</span>
                            <input type="file" className="sr-only" multiple />
                          </label>
                          <p className="pl-1">或拖拽文件到此处</p>
                        </div>
                        <p className="text-xs text-gray-500">支持PNG, JPG, GIF格式，最大5MB</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">电站简介</label>
                    <textarea
                      name="description"
                      rows={3}
                      defaultValue={currentStation?.description || ''}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* 充电桩配置 */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-lg mb-2">充电桩配置</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <div className="mt-6 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  保存
                </button>
            </div>
             </form>
          </div>
        </div>
      )}

      {/* 详情弹窗 */}
      {isDetailOpen && currentStation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold">{currentStation.name} - 详情</h2>
              <button
                onClick={() => setIsDetailOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">地址</h3>
                <p className="mt-1 text-sm text-gray-900">{currentStation.address}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">联系人</h3>
                <p className="mt-1 text-sm text-gray-900">{currentStation.contact}</p>
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
        </div>
      )}
    </div>
  );
}
