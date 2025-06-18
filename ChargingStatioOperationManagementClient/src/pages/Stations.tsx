import { useState, useEffect, useRef } from 'react';
import api from '@/api';
import path from '@/api/path';
import { Pagination } from '@/components/Pagination';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

import { ChargingStation as IChargingStation, ChargingPile as IChargingPile } from '@/types';

// 引入 Leaflet 相关组件
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// 修复 Leaflet 默认图标问题
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

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
  const [position, setPosition] = useState<[number, number]>([39.90923, 116.397428]);
  const mapRef = useRef<L.Map | null>(null);

  // 地图事件处理组件
  function MapEvents() {
    const map = useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setPosition([lat, lng]);
        setCurrentStation(prev => prev ? {
          ...prev,
          lat: lat,
          lng: lng
        } : null);
      },
    });
    return null;
  }
  
  // 地图控制器组件 - 用于监听位置变化并更新地图视图
  function MapController({ position }: { position: [number, number] }) {
    const map = useMap();
    
    useEffect(() => {
      map.setView(position, map.getZoom());
    }, [map, position]);
    
    return null;
  }

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
      
      // 处理运营时间
      const is24Hours = formData.get('is24Hours') === 'on';
      const startTime = is24Hours ? '00:00:00' : (formData.get('startTime') as string) + ':00';
      const endTime = is24Hours ? '00:00:00' : (formData.get('endTime') as string) + ':00';

      const stationData = {
        name: formData.get('name') as string,
        type: stationTypeReverseMap[stationType], // 使用类型映射
        address: formData.get('address') as string,
        state: formData.get('status') === 'active' ? 1 : 0,
        x: currentStation?.lng || 0,
        y: currentStation?.lat || 0,
        startTime,
        endTime,
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

  // 更新地图视图
  const updateMapView = (lat: number, lng: number) => {
    if (mapRef.current) {
      // 设置地图中心位置和缩放级别
      mapRef.current.setView([lat, lng], 13);
      // 更新位置状态
      setPosition([lat, lng]);
    }
  };

  // 当currentStation改变时更新地图位置
  useEffect(() => {
    if (currentStation?.lat && currentStation?.lng) {
      setPosition([currentStation.lat, currentStation.lng]);
    }
  }, [currentStation?.lat, currentStation?.lng]);

  const handleGetLocation = () => {
    setIsGettingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          // 更新当前站点位置
          setCurrentStation(prev => ({
            ...prev!,
            lat,
            lng
          }));
          
          // 更新地图位置状态
          setPosition([lat, lng]);
          
          setIsGettingLocation(false);
          toast.success('获取位置成功');
        },
        (error) => {
          console.error('获取位置失败:', error);
          setIsGettingLocation(false);
          toast.error('获取位置失败');
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
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
                      <label className="block text-sm font-medium text-gray-700">充电站名称<span className="text-red-500">*</span></label>
                      <input
                        name="name"
                        type="text"
                        defaultValue={currentStation?.name || ''}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">详细地址<span className="text-red-500">*</span></label>
                      <input
                        name="address"
                        type="text"
                        defaultValue={currentStation?.address || ''}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">运营时间<span className="text-red-500">*</span></label>
                      <div className="mt-1 space-y-2">
                        <div className="flex items-center space-x-2">
                          <div className="flex-1">
                            <label className="text-xs text-gray-500">开始时间</label>
                            <input
                              name="startTime"
                              type="time"
                              defaultValue={currentStation?.startTime ? currentStation.startTime.substring(0, 5) : '00:00'}
                              required
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <span className="text-gray-500 self-end pb-2">至</span>
                          <div className="flex-1">
                            <label className="text-xs text-gray-500">结束时间</label>
                            <input
                              name="endTime"
                              type="time"
                              defaultValue={currentStation?.endTime ? currentStation.endTime.substring(0, 5) : '00:00'}
                              required
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="is24Hours"
                            name="is24Hours"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            onChange={(e) => {
                              const startTimeInput = document.querySelector('input[name="startTime"]') as HTMLInputElement;
                              const endTimeInput = document.querySelector('input[name="endTime"]') as HTMLInputElement;
                              if (e.target.checked) {
                                startTimeInput.value = '00:00';
                                endTimeInput.value = '00:00';
                                startTimeInput.disabled = true;
                                endTimeInput.disabled = true;
                              } else {
                                startTimeInput.disabled = false;
                                endTimeInput.disabled = false;
                              }
                            }}
                            defaultChecked={currentStation?.startTime === '00:00:00' && currentStation?.endTime === '00:00:00'}
                          />
                          <label htmlFor="is24Hours" className="ml-2 text-sm text-gray-600">
                            24小时营业
                          </label>
                        </div>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">选择24小时营业将自动设置为 00:00 - 00:00</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">状态<span className="text-red-500">*</span></label>
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
                  
                                      <div className="space-y-2">
                                        <div className="h-60 rounded-md overflow-hidden" style={{ border: '1px solid #e5e7eb' }}>
                                          <MapContainer
                                            center={position}
                                            zoom={13}
                                            style={{ height: '100%', width: '100%' }}
                                            ref={(map) => {
                                              if (map) mapRef.current = map;
                                            }}
                                            scrollWheelZoom={true}
                                            doubleClickZoom={true}
                                          >
                                            <TileLayer
                                              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            />
                                            <Marker 
                                              position={position}
                                              draggable={true}
                                              eventHandlers={{
                                                dragend: (e) => {
                                                  const marker = e.target;
                                                  const position = marker.getLatLng();
                                                  setPosition([position.lat, position.lng]);
                                                  setCurrentStation(prev => ({
                                                    ...prev!,
                                                    lat: position.lat,
                                                    lng: position.lng
                                                  }));
                                                },
                                              }}
                                            />
                                            <MapEvents />
                                            <MapController position={position} />
                                          </MapContainer>
                                        </div>
                                        <div className="flex space-x-2">
                                          <button
                                            type="button"
                                            onClick={handleGetLocation}
                                            disabled={isGettingLocation}
                                            className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
                                          >
                                            {isGettingLocation ? '获取中...' : '获取当前位置'}
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => {
                                              const defaultLat = currentStation?.lat || 39.90923;
                                              const defaultLng = currentStation?.lng || 116.397428;
                                              updateMapView(defaultLat, defaultLng);
                                            }}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                          >
                                            重置位置
                                          </button>
                                        </div>
                                        {currentStation?.lat && currentStation?.lng && (
                                          <div className="text-sm text-gray-500">
                                            当前坐标: {currentStation.lat.toFixed(6)}, {currentStation.lng.toFixed(6)}
                                          </div>
                                        )}
                                      </div>
                </div>


                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <h3 className="font-medium text-lg mb-2">充电站图片</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">上传图片</label>
                    <div className="mt-1 flex flex-col space-y-4">
                      {/* 图片预览区域 */}
                      {currentStation?.picture && (
                        <div className="relative w-full h-32">
                          <img 
                            src={currentStation.picture} 
                            alt="充电站图片" 
                            className="h-32 w-auto object-cover rounded"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const form = document.getElementById('stationForm') as HTMLFormElement;
                              if (form) {
                                const pictureInput = form.querySelector('input[name="picture"]') as HTMLInputElement;
                                if (pictureInput) {
                                  pictureInput.value = '';
                                }
                              }
                              setCurrentStation(prev => prev ? {...prev, picture: ''} : null);
                            }}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      )}
                      
                      {/* 图片预览区域 */}
                      {currentStation?.picture && (
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-700 mb-2">当前图片预览</p>
                          <div className="relative w-full h-48 overflow-hidden rounded-md">
                            <img 
                              src={currentStation.picture} 
                              alt="充电站图片" 
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none"
                              onClick={() => {
                                setCurrentStation(prev => prev ? {...prev, picture: ''} : null);
                                const pictureInput = document.querySelector('input[name="picture"]') as HTMLInputElement;
                                if (pictureInput) {
                                  pictureInput.value = '';
                                }
                              }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      )}

                      {/* 文件上传区域 */}
                      <div 
                        className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md"
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          e.currentTarget.classList.add('border-blue-500');
                        }}
                        onDragLeave={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          e.currentTarget.classList.remove('border-blue-500');
                        }}
                        onDrop={async (e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          e.currentTarget.classList.remove('border-blue-500');
                          
                          const files = e.dataTransfer.files;
                          if (files.length > 0) {
                            const file = files[0];
                            if (file.type.startsWith('image/')) {
                              const formData = new FormData();
                              formData.append('file', file);
                              try {
                                toast.loading('正在上传图片...');
                                const response = await api.upload_file(formData);
                                if (response.data.code === 200) {
                                  const pictureUrl = response.data.data;
                                  setCurrentStation(prev => prev ? {...prev, picture: pictureUrl} : null);
                                  const pictureInput = document.querySelector('input[name="picture"]') as HTMLInputElement;
                                  if (pictureInput) {
                                    pictureInput.value = pictureUrl;
                                  }
                                  toast.success('上传成功');
                                } else {
                                  toast.error('上传失败：' + response.data.msg);
                                }
                              } catch (error) {
                                console.error('Upload failed:', error);
                                toast.error('上传失败');
                              }
                            } else {
                              toast.error('请上传图片文件');
                            }
                          }
                        }}
                      >
                        <div className="space-y-1 text-center">
                          <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                            aria-hidden="true"
                          >
                            <path
                              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <div className="flex text-sm text-gray-600">
                            <label
                              htmlFor="file-upload"
                              className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                            >
                              <span>上传图片</span>
                              <input
                                id="file-upload"
                                name="file"
                                type="file"
                                accept="image/*"
                                className="sr-only"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const formData = new FormData();
                                    formData.append('file', file);
                                    try {
                                      toast.loading('正在上传图片...');
                                      const response = await api.upload_file(formData);
                                      if (response.data.code === 200) {
                                        const pictureUrl = response.data.data;
                                        setCurrentStation(prev => prev ? {...prev, picture: pictureUrl} : null);
                                        const pictureInput = document.querySelector('input[name="picture"]') as HTMLInputElement;
                                        if (pictureInput) {
                                          pictureInput.value = pictureUrl;
                                        }
                                        toast.success('上传成功');
                                      } else {
                                        toast.error('上传失败：' + response.data.msg);
                                      }
                                    } catch (error) {
                                      console.error('Upload failed:', error);
                                      toast.error('上传失败');
                                    }
                                  }
                                }}
                              />
                            </label>
                            <p className="pl-1">或拖拽图片到此处</p>
                          </div>
                          <p className="text-xs text-gray-500">PNG, JPG, GIF 最大 10MB</p>
                        </div>
                      </div>

                      {/* URL输入框作为备选方案 */}
                      <div className="mt-1">
                        <input
                          type="text"
                          name="picture"
                          defaultValue={currentStation?.picture || ''}
                          placeholder="或直接输入图片URL"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                        <p className="mt-1 text-xs text-gray-500">如果已有图片链接，可以直接输入URL地址</p>
                      </div>
                    </div>
                  </div>
                  <h3 className="font-medium text-lg mb-2 mt-4">充电桩配置</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">汽车充电桩数<span className="text-red-500">*</span></label>
                      <input
                        name="carPiles"
                        type="number"
                        min="0"
                        defaultValue={currentStation?.carPiles || 0}
                        required
                        disabled
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">电瓶车充电桩数<span className="text-red-500">*</span></label>
                      <input
                        name="bikePiles"
                        type="number"
                        min="0"
                        defaultValue={currentStation?.bikePiles || 0}
                        required
                        disabled
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">公交车充电桩数<span className="text-red-500">*</span></label>
                      <input
                        name="busPiles"
                        type="number"
                        min="0"
                        defaultValue={currentStation?.busPiles || 0}
                        required
                        disabled
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <h3 className="font-medium text-lg mb-2 mt-4">计费规则</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">选择计费规则<span className="text-red-500">*</span></label>
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