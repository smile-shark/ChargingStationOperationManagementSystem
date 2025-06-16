import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Pagination } from '@/components/Pagination';

interface Pile {
  id: string;
  code: string;
  name: string;
  category: 'car' | 'bike' | 'bus';
  type: 'hybrid' | 'dc' | 'ac';
  gunCount: number;
  power: number;
  stationId: string;
  stationName: string;
  status: 'idle' | 'charging' | 'offline' | 'fault';
  location: string;
  description: string;
  images: string[];
}

export default function Piles() {
  const [selectedStation, setSelectedStation] = useState<string>('1');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentPile, setCurrentPile] = useState<Pile | null>(null);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock数据
  const [piles, setPiles] = useState<Pile[]>([
    {
      id: '1',
      code: 'P001',
      name: '直流快充桩1',
      category: 'car',
      type: 'dc',
      gunCount: 2,
      power: 60,
      stationId: '1',
      stationName: '北京朝阳充电站',
      status: 'idle',
      location: 'A区1号位',
      description: '大功率直流快充桩',
      images: []
    },
    {
      id: '2',
      code: 'P002',
      name: '交流慢充桩1',
      category: 'car',
      type: 'ac',
      gunCount: 1,
      power: 7,
      stationId: '1',
      stationName: '北京朝阳充电站',
      status: 'charging',
      location: 'B区2号位',
      description: '普通交流慢充桩',
      images: []
    },
    {
      id: '3',
      code: 'P003',
      name: '电瓶车充电桩1',
      category: 'bike',
      type: 'ac',
      gunCount: 10,
      power: 3,
      stationId: '2',
      stationName: '上海浦东充电站',
      status: 'idle',
      location: 'C区3号位',
      description: '电瓶车专用充电桩',
      images: []
    },
    {
      id: '4',
      code: 'P004',
      name: '公交车充电桩1',
      category: 'bus',
      type: 'dc',
      gunCount: 1,
      power: 120,
      stationId: '3',
      stationName: '广州天河充电站',
      status: 'fault',
      location: 'D区4号位',
      description: '公交车大功率充电桩',
      images: []
    },
    // 新增更多测试数据
    ...Array.from({length: 21}, (_, i) => ({
      id: `${i + 5}`,
      code: `P${(i + 5).toString().padStart(3, '0')}`,
      name: ['直流快充桩', '交流慢充桩', '电瓶车充电桩', '公交车充电桩'][i % 4] + (i + 1),
      category: ['car', 'bike', 'bus'][i % 3],
      type: ['dc', 'ac', 'hybrid'][i % 3],
      gunCount: [1, 2, 4, 6, 8, 10][i % 6],
      power: [7, 11, 22, 60, 120][i % 5],
      stationId: ['1', '2', '3'][i % 3],
      stationName: ['北京朝阳充电站', '上海浦东充电站', '广州天河充电站'][i % 3],
      status: ['idle', 'charging', 'offline', 'fault'][i % 4],
      location: `${['A', 'B', 'C', 'D'][i % 4]}区${i + 1}号位`,
      description: '测试充电桩描述',
      images: []
    }))
  ]);

  // 过滤当前站点的充电桩
  const filteredPiles = useMemo(() => {
    return piles.filter(pile => selectedStation === 'all' || pile.stationId === selectedStation);
  }, [selectedStation, piles]);

  // 分页数据
  const paginatedPiles = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredPiles.slice(start, end);
  }, [filteredPiles, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredPiles.length / itemsPerPage);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'charging': return 'bg-blue-500';
      case 'idle': return 'bg-green-500';
      case 'offline': return 'bg-gray-500';
      case 'fault': return 'bg-red-500';
      default: return 'bg-gray-300';
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'car': return '汽车充电桩';
      case 'bike': return '电瓶车充电桩';
      case 'bus': return '大型公交车充电桩';
      default: return category;
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'hybrid': return '混合型(交直流)';
      case 'dc': return '直流桩';
      case 'ac': return '交流桩';
      default: return type;
    }
  };

  const handleDelete = (id: string) => {
    setPiles(piles.filter(pile => pile.id !== id));
    toast.success('删除成功');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newImages = files.map(file => URL.createObjectURL(file));
      setUploadedImages(prev => [...prev, ...newImages]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">充电桩管理</h1>
        <button
          onClick={() => {
            setCurrentPile(null);
            setUploadedImages([]);
            setIsFormOpen(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          新增充电桩
        </button>
      </div>

      {/* 站点选择 */}
      <div className="flex items-center space-x-4">
        <label className="text-gray-700">选择站点：</label>
        <select
          value={selectedStation}
          onChange={(e) => setSelectedStation(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">全部站点</option>
          <option value="1">北京朝阳充电站</option>
          <option value="2">上海浦东充电站</option>
          <option value="3">广州天河充电站</option>
        </select>
      </div>

      {/* 充电桩列表 */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">充电桩编号</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">名称</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">类别</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">类型</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">充电枪数量</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">功率(kW)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">安装位置</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">归属充电站</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedPiles.map(pile => (
              <tr key={pile.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{pile.code}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{pile.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getCategoryName(pile.category)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getTypeName(pile.type)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pile.gunCount}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pile.power}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pile.location}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pile.stationName}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(pile.status)} text-white`}>
                    {pile.status === 'charging' ? '充电中' : 
                     pile.status === 'idle' ? '空闲' : 
                     pile.status === 'offline' ? '离线' : '故障'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-2">
                  <button
                    onClick={() => {
                      setCurrentPile(pile);
                      setUploadedImages(pile.images);
                      setIsFormOpen(true);
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    编辑
                  </button>
                  <button
                    onClick={() => handleDelete(pile.id)}
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
            totalPages={Math.ceil(filteredPiles.length / itemsPerPage)}
            onPageChange={setCurrentPage}
          />
        </div>

      {/* 表单弹窗 */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold">{currentPile ? '编辑充电桩' : '新增充电桩'}</h2>
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
              const pile = {
                id: currentPile?.id || Date.now().toString(),
                code: formData.get('code') as string,
                name: formData.get('name') as string,
                category: formData.get('category') as 'car' | 'bike' | 'bus',
                type: formData.get('type') as 'hybrid' | 'dc' | 'ac',
                gunCount: parseInt(formData.get('gunCount') as string),
                power: parseInt(formData.get('power') as string),
                stationId: selectedStation,
                stationName: formData.get('stationName') as string,
                status: formData.get('status') as 'idle' | 'charging' | 'offline' | 'fault',
                location: formData.get('location') as string,
                description: formData.get('description') as string,
                images: uploadedImages
              };
              if (currentPile) {
                setPiles(piles.map(p => p.id === currentPile.id ? pile : p));
              } else {
                setPiles([...piles, pile]);
              }
              setIsFormOpen(false);
              toast.success(currentPile ? '更新成功' : '添加成功');
            }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 左侧表单 */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">充电桩编号*</label>
                    <input
                      name="code"
                      type="text"
                      defaultValue={currentPile?.code || ''}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">名称*</label>
                    <input
                      name="name"
                      type="text"
                      defaultValue={currentPile?.name || ''}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">类别*</label>
                    <select
                      name="category"
                      defaultValue={currentPile?.category || 'car'}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="car">汽车充电桩</option>
                      <option value="bike">电瓶车充电桩</option>
                      <option value="bus">大型公交车充电桩</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">类型*</label>
                    <select
                      name="type"
                      defaultValue={currentPile?.type || 'hybrid'}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="hybrid">混合型(交直流)</option>
                      <option value="dc">直流桩</option>
                      <option value="ac">交流桩</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">充电枪数量*</label>
                    <input
                      name="gunCount"
                      type="number"
                      min="1"
                      defaultValue={currentPile?.gunCount || 1}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* 右侧表单 */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">功率(kW)*</label>
                    <input
                      name="power"
                      type="number"
                      min="1"
                      defaultValue={currentPile?.power || 7}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">安装位置*</label>
                    <input
                      name="location"
                      type="text"
                      defaultValue={currentPile?.location || ''}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">归属充电站*</label>
                    <input
                      name="stationName"
                      type="text"
                      defaultValue={currentPile?.stationName || ''}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">状态*</label>
                    <select
                      name="status"
                      defaultValue={currentPile?.status || 'idle'}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="idle">空闲</option>
                      <option value="charging">充电中</option>
                      <option value="offline">离线</option>
                      <option value="fault">故障</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">描述</label>
                    <textarea
                      name="description"
                      rows={3}
                      defaultValue={currentPile?.description || ''}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* 图片上传 */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700">充电桩图片</label>
                <div className="mt-2 flex flex-wrap gap-4">
                  {uploadedImages.map((img, index) => (
                    <div key={index} className="relative">
                      <img 
                        src={img} 
                        alt={`充电桩图片 ${index + 1}`}
                        className="w-24 h-24 object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                      >
                        <i className="fas fa-times text-xs"></i>
                      </button>
                    </div>
                  ))}
                  <label className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-blue-500">
                    <i className="fas fa-plus text-gray-400 mb-1"></i>
                    <span className="text-xs text-gray-500">上传图片</span>
                    <input 
                      type="file" 
                      className="hidden" 
                      multiple 
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
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
    </div>
  );
}