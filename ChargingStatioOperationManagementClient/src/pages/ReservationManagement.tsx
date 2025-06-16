import { useState } from 'react';
import { Pagination } from '@/components/Pagination';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { mockReservations } from '@/lib/mockData';

export default function ReservationManagement() {
  const [reservations, setReservations] = useState(mockReservations);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentReservation, setCurrentReservation] = useState<typeof mockReservations[0] | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredReservations = reservations.filter(res => 
    res.pileId.toLowerCase().includes(searchTerm.toLowerCase()) || 
    res.pileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    res.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedReservations = filteredReservations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredReservations.length / itemsPerPage);

  const handleCancel = (id: string) => {
    setReservations(reservations.map(res => 
      res.id === id ? {...res, status: 'canceled'} : res
    ));
    toast.success('预约已取消');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">预约管理</h1>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="搜索充电桩编号、名称或客户..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // 搜索时重置到第一页
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => {
              setCurrentReservation(null);
              setIsFormOpen(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            新增预约
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">充电桩编号</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">充电桩名称</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">安装位置</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">预约时长(分钟)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">预约开始时间</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">预约客户</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedReservations.map(res => (
              <tr key={res.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{res.pileId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{res.pileName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{res.location}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{res.duration}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{res.startTime}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{res.customer}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    res.status === 'reserved' ? 'bg-blue-500' : 'bg-gray-500'
                  } text-white`}>
                    {res.status === 'reserved' ? '已预约' : '已取消'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-2">
                  <button
                    onClick={() => {
                      setCurrentReservation(res);
                      setIsFormOpen(true);
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    查看
                  </button>
                  <button
                    onClick={() => {
                      setCurrentReservation(res);
                      setIsFormOpen(true);
                    }}
                    className="text-green-600 hover:text-green-800"
                  >
                    编辑
                  </button>
                  {res.status === 'reserved' && (
                    <button
                      onClick={() => {
                        if (confirm('确定要取消此预约吗？')) {
                          handleCancel(res.id);
                        }
                      }}
                      className="text-yellow-600 hover:text-yellow-800"
                    >
                      取消
                    </button>
                  )}
                  <button
                    onClick={() => {
                      if (confirm('确定要删除此预约记录吗？')) {
                        setReservations(reservations.filter(r => r.id !== res.id));
                        toast.success('删除成功');
                      }
                    }}
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

      {/* 表单弹窗 */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold">{currentReservation ? '编辑预约' : '新增预约'}</h2>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const formData = new FormData(form);
              const reservation = {
                id: currentReservation?.id || Date.now().toString(),
                pileId: formData.get('pileId') as string,
                pileName: formData.get('pileName') as string,
                location: formData.get('location') as string,
                duration: parseInt(formData.get('duration') as string),
                startTime: formData.get('startTime') as string,
                customer: formData.get('customer') as string,
                status: 'reserved' as const
              };
              if (currentReservation) {
                setReservations(reservations.map(r => r.id === currentReservation.id ? reservation : r));
              } else {
                setReservations([...reservations, reservation]);
              }
              setIsFormOpen(false);
              toast.success(currentReservation ? '更新成功' : '添加成功');
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">充电桩编号</label>
                  <input
                    name="pileId"
                    type="text"
                    defaultValue={currentReservation?.pileId || ''}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">充电桩名称</label>
                  <input
                    name="pileName"
                    type="text"
                    defaultValue={currentReservation?.pileName || ''}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">安装位置</label>
                  <input
                    name="location"
                    type="text"
                    defaultValue={currentReservation?.location || ''}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">预约时长(分钟)</label>
                  <input
                    name="duration"
                    type="number"
                    min="1"
                    defaultValue={currentReservation?.duration || 60}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">预约开始时间</label>
                  <input
                    name="startTime"
                    type="datetime-local"
                    defaultValue={currentReservation?.startTime || ''}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">预约客户</label>
                  <input
                    name="customer"
                    type="text"
                    defaultValue={currentReservation?.customer || ''}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
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
          </div>
        </div>
      )}
    </div>
  );
}