import { useState } from 'react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { mockVehicles, mockVehicleFaults, type VehicleFault } from '@/lib/mockData';
import { Pagination } from '@/components/Pagination';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface Vehicle {
  id: string;
  plateNumber: string;
  brandModel: string;
  type: 'pure' | 'hybrid';
  color: string;
  batteryCapacity: number;
  range: number;
  customerId: string;
  customerName: string;
  status: 'active' | 'inactive';
}

export default function VehicleManagement() {
  const [vehicles, setVehicles] = useState(mockVehicles);
  const [faults, setFaults] = useState(mockVehicleFaults);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isFaultFormOpen, setIsFaultFormOpen] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState<Vehicle | null>(null);
  const [currentFault, setCurrentFault] = useState<VehicleFault | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'info' | 'faults'>('info');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
 
  const filteredVehicles = vehicles.filter(vehicle =>
    vehicle.plateNumber.includes(searchTerm) || 
    vehicle.brandModel.includes(searchTerm) ||
    vehicle.customerName.includes(searchTerm)
  );

  const paginatedVehicles = filteredVehicles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);

  const vehicleFaults = (vehicleId: string) => 
    faults.filter(fault => fault.vehicleId === vehicleId);

  const handleDelete = (id: string) => {
    setVehicles(vehicles.filter(vehicle => vehicle.id !== id));
    toast.success('删除成功');
  };

  const handleStatusChange = (id: string, status: 'active' | 'inactive') => {
    setVehicles(vehicles.map(vehicle => 
      vehicle.id === id ? {...vehicle, status} : vehicle
    ));
    toast.success(`车辆已${status === 'active' ? '启用' : '停用'}`);
  };

  const handleDeleteFault = (id: string) => {
    setFaults(faults.filter(fault => fault.id !== id));
    toast.success('故障记录已删除');
  };

  const handleFaultStatusChange = (id: string, status: 'pending' | 'processing' | 'resolved') => {
    setFaults(faults.map(fault => 
      fault.id === id ? {...fault, status} : fault
    ));
    toast.success('故障状态已更新');
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'bg-green-500' : 'bg-gray-500';
  };

  const getFaultStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-yellow-500';
      case 'processing': return 'bg-blue-500';
      case 'resolved': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeName = (type: string) => {
    return type === 'pure' ? '纯电' : '混合动力';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">车辆管理</h1>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="搜索车牌、品牌或客户..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
           <button
            onClick={() => {
              const newVehicle = {
                id: Date.now().toString(),
                plateNumber: '',
                brandModel: '',
                type: 'pure',
                color: '',
                batteryCapacity: 0,
                range: 0,
                customerId: '1',
                customerName: '',
                status: 'active'
              };
              setCurrentVehicle(newVehicle);
              setIsFormOpen(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            新增车辆
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">车牌号码</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">品牌型号</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">车辆类型</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">颜色</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">电池容量(kWh)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">续航里程(km)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">关联客户</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedVehicles.map(vehicle => (
              <tr key={vehicle.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{vehicle.plateNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vehicle.brandModel}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getTypeName(vehicle.type)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vehicle.color}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vehicle.batteryCapacity}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vehicle.range}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vehicle.customerName}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(vehicle.status)} text-white`}>
                    {vehicle.status === 'active' ? '启用' : '停用'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-2">
                  <button
                    onClick={() => {
                      setCurrentVehicle(vehicle);
                      setActiveTab('info');
                      setIsFormOpen(true);
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    编辑
                  </button>
                  <button
                    onClick={() => handleStatusChange(vehicle.id, vehicle.status === 'active' ? 'inactive' : 'active')}
                    className="text-yellow-600 hover:text-yellow-800"
                  >
                    {vehicle.status === 'active' ? '停用' : '启用'}
                  </button>
                  <button
                    onClick={() => handleDelete(vehicle.id)}
                    className="text-red-600 hover:text-red-800"
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

      {/* 车辆表单弹窗 */}
      {isFormOpen && currentVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
            <div className="flex border-b border-gray-200 mb-4">
              <button
                onClick={() => setActiveTab('info')}
                className={cn(
                  'px-4 py-2 font-medium',
                  activeTab === 'info'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                )}
              >
                车辆信息
              </button>
              <button
                onClick={() => setActiveTab('faults')}
                className={cn(
                  'px-4 py-2 font-medium',
                  activeTab === 'faults'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                )}
              >
                故障记录
              </button>
            </div>

            {activeTab === 'info' ? (
              <form onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const formData = new FormData(form);
                const vehicle = {
                  id: currentVehicle.id,
                  plateNumber: formData.get('plateNumber') as string,
                  brandModel: formData.get('brandModel') as string,
                  type: formData.get('type') as 'pure' | 'hybrid',
                  color: formData.get('color') as string,
                  batteryCapacity: parseFloat(formData.get('batteryCapacity') as string),
                  range: parseFloat(formData.get('range') as string),
                  customerId: formData.get('customerId') as string,
                  customerName: formData.get('customerName') as string,
                  status: formData.get('status') as 'active' | 'inactive'
                };
                setVehicles(vehicles.map(v => v.id === currentVehicle.id ? vehicle : v));
                setIsFormOpen(false);
                toast.success('更新成功');
              }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      <span>车牌号码</span>
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      name="plateNumber"
                      type="text"
                      defaultValue={currentVehicle.plateNumber}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">品牌型号*</label>
                    <input
                      name="brandModel"
                      type="text"
                      defaultValue={currentVehicle.brandModel}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">车辆类型*</label>
                    <select
                      name="type"
                      defaultValue={currentVehicle.type}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="pure">纯电</option>
                      <option value="hybrid">混合动力</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">颜色*</label>
                    <input
                      name="color"
                      type="text"
                      defaultValue={currentVehicle.color}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">电池容量(kWh)*</label>
                    <input
                      name="batteryCapacity"
                      type="number"
                      min="0"
                      step="0.1"
                      defaultValue={currentVehicle.batteryCapacity}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">续航里程(km)*</label>
                    <input
                      name="range"
                      type="number"
                      min="0"
                      defaultValue={currentVehicle.range}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">关联客户*</label>
                    <select
                      name="customerId"
                      defaultValue={currentVehicle.customerId}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="1">张三</option>
                      <option value="2">李四</option>
                      <option value="3">王五</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">状态*</label>
                    <select
                      name="status"
                      defaultValue={currentVehicle.status}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="active">启用</option>
                      <option value="inactive">停用</option>
                    </select>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setIsFormOpen(false)}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                    >
                      取消
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      保存
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">故障记录</h3>
                  <button
                    onClick={() => {
                      setCurrentFault({
                        id: '',
                        vehicleId: currentVehicle.id,
                        faultTime: new Date().toISOString(),
                        description: '',
                        status: 'pending'
                      });
                      setIsFaultFormOpen(true);
                    }}
                    className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    新增故障
                  </button>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  {vehicleFaults(currentVehicle.id).length > 0 ? (
                    <div className="space-y-2">
                      {vehicleFaults(currentVehicle.id).map(fault => (
                        <div key={fault.id} className="bg-white p-3 rounded-lg shadow-sm">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{new Date(fault.faultTime).toLocaleString()}</p>
                              <p className="text-sm text-gray-600 mt-1">{fault.description}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getFaultStatusColor(fault.status)} text-white`}>
                                {fault.status === 'pending' ? '待处理' : fault.status === 'processing' ? '处理中' : '已解决'}
                              </span>
                              <button
                                onClick={() => {
                                  setCurrentFault(fault);
                                  setIsFaultFormOpen(true);
                                }}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                编辑
                              </button>
                              <button
                                onClick={() => handleDeleteFault(fault.id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                删除
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">暂无故障记录</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 故障表单弹窗 */}
      {isFaultFormOpen && currentFault && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold">{currentFault.id ? '编辑故障' : '新增故障'}</h2>
              <button
                onClick={() => setIsFaultFormOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const formData = new FormData(form);
              const fault = {
                id: currentFault.id || Date.now().toString(),
                vehicleId: currentVehicle?.id || '',
                faultTime: (formData.get('faultTime') as string) || new Date().toISOString(),
                description: formData.get('description') as string,
                status: formData.get('status') as 'pending' | 'processing' | 'resolved'
              };
              if (currentFault.id) {
                setFaults(faults.map(f => f.id === currentFault.id ? fault : f));
              } else {
                setFaults([...faults, fault]);
              }
              setIsFaultFormOpen(false);
              toast.success(currentFault.id ? '更新成功' : '添加成功');
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">故障时间*</label>
                  <DatePicker
                    selected={new Date(currentFault.faultTime)}
                    onChange={(date) => setCurrentFault({...currentFault, faultTime: date?.toISOString() || ''})}
                    showTimeSelect
                    dateFormat="yyyy-MM-dd HH:mm"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">描述*</label>
                  <textarea
                    name="description"
                    rows={3}
                    defaultValue={currentFault.description}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">状态*</label>
                  <select
                    name="status"
                    defaultValue={currentFault.status}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="pending">待处理</option>
                    <option value="processing">处理中</option>
                    <option value="resolved">已解决</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsFaultFormOpen(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    保存
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}