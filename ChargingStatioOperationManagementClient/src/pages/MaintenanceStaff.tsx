import { useState } from 'react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import * as XLSX from 'xlsx';

interface IMaintenanceStaff {
  id: string;
  avatar: string;
  certificates: string[];
  status: 'online' | 'offline';
  name: string;
  staffNo: string;
  phone: string;
  email: string;
  department: string;
  position: string;
  joinDate: string;
}

const mockStaff: IMaintenanceStaff[] = [
  {
    id: '1',
    avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=technician%20avatar&sign=46c5900eca149be8d0972aa7b488bd25',
    certificates: ['电工证', '高压作业证'],
    status: 'online',
    name: '张三',
    staffNo: 'S001',
    phone: '13800138000',
    email: 'zhangsan@example.com',
    department: '运维一部',
    position: '高级运维工程师',
    joinDate: '2020-05-15'
  },
  {
    id: '2',
    avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=female%20technician%20avatar&sign=09647a66c00171b2a84b02d30924562b',
    certificates: ['电工证'],
    status: 'offline',
    name: '李四',
    staffNo: 'S002',
    phone: '13900139000',
    email: 'lisi@example.com',
    department: '运维二部',
    position: '运维工程师',
    joinDate: '2021-08-20'
  },
  {
    id: '3',
    avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=technician%20avatar&sign=46c5900eca149be8d0972aa7b488bd25',
    certificates: ['高压作业证', '安全员证'],
    status: 'online',
    name: '王五',
    staffNo: 'S003',
    phone: '13700137000',
    email: 'wangwu@example.com',
    department: '运维三部',
    position: '运维主管',
    joinDate: '2019-03-10'
  }
];

export default function MaintenanceStaff() {
  const [staff, setStaff] = useState<IMaintenanceStaff[]>(mockStaff);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentStaff, setCurrentStaff] = useState<IMaintenanceStaff | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStaff = staff.filter(person => 
    (statusFilter === 'all' || person.status === statusFilter) &&
    (person.name.includes(searchTerm) || 
     person.staffNo.includes(searchTerm) ||
     person.phone.includes(searchTerm))
  );

  const getStatusColor = (status: string) => {
    return status === 'online' ? 'bg-green-500' : 'bg-gray-500';
  };

  const toggleStatus = (id: string) => {
    setStaff(staff.map(person => 
      person.id === id ? {
        ...person,
        status: person.status === 'online' ? 'offline' : 'online'
      } : person
    ));
    toast.success('状态已更新');
  };

  const handleDelete = (id: string) => {
    setStaff(staff.filter(person => person.id !== id));
    toast.success('删除成功');
  };

  const handleExport = () => {
    const dataToExport = staff.map(person => ({
      员工编号: person.staffNo,
      姓名: person.name,
      电话: person.phone,
      邮箱: person.email,
      部门: person.department,
      职位: person.position,
      入职日期: person.joinDate,
      状态: person.status === 'online' ? '在线' : '离线',
      证书: person.certificates.join(', ')
    }));
    
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "运维人员");
    XLSX.writeFile(wb, "运维人员.xlsx");
    toast.success('导出成功');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">运维人员管理</h1>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="搜索姓名、工号或电话..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => {
              setCurrentStaff(null);
              setIsFormOpen(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            新增人员
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            导出Excel
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-4 mb-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">全部状态</option>
          <option value="online">在线</option>
          <option value="offline">离线</option>
        </select>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">员工编号</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">姓名</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">电话</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">部门</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">职位</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredStaff.map(person => (
              <tr key={person.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{person.staffNo}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{person.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{person.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{person.department}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{person.position}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(person.status)} text-white`}>
                    {person.status === 'online' ? '在线' : '离线'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-2">
                  <button
                    onClick={() => {
                      setCurrentStaff(person);
                      setIsFormOpen(true);
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    查看
                  </button>
                  <button
                    onClick={() => {
                      setCurrentStaff(person);
                      setIsFormOpen(true);
                    }}
                    className="text-green-600 hover:text-green-800"
                  >
                    编辑
                  </button>
                  <button
                    onClick={() => toggleStatus(person.id)}
                    className="text-yellow-600 hover:text-yellow-800"
                  >
                    {person.status === 'online' ? '设为离线' : '设为在线'}
                  </button>
                  <button
                    onClick={() => handleDelete(person.id)}
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

      {/* 表单弹窗 */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold">{currentStaff ? '编辑运维人员' : '新增运维人员'}</h2>
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
              const newStaff = {
                id: currentStaff?.id || Date.now().toString(),
                avatar: currentStaff?.avatar || 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=technician%20avatar',
                certificates: (formData.get('certificates') as string).split(',').map(c => c.trim()),
                status: formData.get('status') as 'online' | 'offline',
                name: formData.get('name') as string,
                staffNo: formData.get('staffNo') as string,
                phone: formData.get('phone') as string,
                email: formData.get('email') as string,
                department: formData.get('department') as string,
                position: formData.get('position') as string,
                joinDate: formData.get('joinDate') as string
              };
              if (currentStaff) {
                setStaff(staff.map(s => s.id === currentStaff.id ? newStaff : s));
              } else {
                setStaff([...staff, newStaff]);
              }
              setIsFormOpen(false);
              toast.success(currentStaff ? '更新成功' : '添加成功');
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">姓名*</label>
                  <input
                    name="name"
                    type="text"
                    defaultValue={currentStaff?.name || ''}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">工号*</label>
                  <input
                    name="staffNo"
                    type="text"
                    defaultValue={currentStaff?.staffNo || ''}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">电话*</label>
                  <input
                    name="phone"
                    type="tel"
                    defaultValue={currentStaff?.phone || ''}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">邮箱</label>
                  <input
                    name="email"
                    type="email"
                    defaultValue={currentStaff?.email || ''}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">部门</label>
                  <input
                    name="department"
                    type="text"
                    defaultValue={currentStaff?.department || ''}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">职位</label>
                  <input
                    name="position"
                    type="text"
                    defaultValue={currentStaff?.position || ''}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">入职日期</label>
                  <input
                    name="joinDate"
                    type="date"
                    defaultValue={currentStaff?.joinDate || ''}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">证书(逗号分隔)</label>
                  <input
                    name="certificates"
                    type="text"
                    defaultValue={currentStaff?.certificates.join(', ') || ''}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">状态*</label>
                  <select
                    name="status"
                    defaultValue={currentStaff?.status || 'online'}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="online">在线</option>
                    <option value="offline">离线</option>
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
          </div>
        </div>
      )}
    </div>
  );
}
