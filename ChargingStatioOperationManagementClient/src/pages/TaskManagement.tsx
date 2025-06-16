import { useState } from 'react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import * as XLSX from 'xlsx';

interface Task {
  id: string;
  taskNo: string;
  name: string;
  type: 'repair' | 'maintenance' | 'alarm';
  plannedStart: string;
  plannedEnd: string;
  actualStart?: string;
  actualEnd?: string;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  station: string;
  description: string;
  assignee: string;
  submitter: string;
  submitTime: string;
  rejectReason?: string;
}

const mockTasks: Task[] = [
  {
    id: '1',
    taskNo: 'T20230614001',
    name: '朝阳站充电桩抢修',
    type: 'repair',
    plannedStart: '2025-06-14 10:00:00',
    plannedEnd: '2025-06-14 12:00:00',
    actualStart: '2025-06-14 10:15:00',
    status: 'processing',
    station: '北京朝阳充电站',
    description: '充电桩无法启动，需要紧急维修',
    assignee: '张三',
    submitter: '李四',
    submitTime: '2025-06-14 09:30:00'
  },
  {
    id: '2',
    taskNo: 'T20230614002',
    name: '浦东站定期维护',
    type: 'maintenance',
    plannedStart: '2025-06-15 09:00:00',
    plannedEnd: '2025-06-15 11:00:00',
    status: 'pending',
    station: '上海浦东充电站',
    description: '例行设备检查和维护',
    assignee: '王五',
    submitter: '赵六',
    submitTime: '2025-06-14 14:00:00'
  },
  {
    id: '3',
    taskNo: 'T20230613001',
    name: '天河站报警处理',
    type: 'alarm',
    plannedStart: '2025-06-13 14:00:00',
    plannedEnd: '2025-06-13 15:00:00',
    actualStart: '2025-06-13 14:05:00',
    actualEnd: '2025-06-13 14:50:00',
    status: 'completed',
    station: '广州天河充电站',
    description: '处理充电桩温度过高报警',
    assignee: '钱七',
    submitter: '孙八',
    submitTime: '2025-06-13 13:30:00'
  }
];

export default function TaskManagement() {
  const [tasks, setTasks] = useState(mockTasks);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const filteredTasks = tasks.filter(task => {
    return (statusFilter === 'all' || task.status === statusFilter) &&
           (typeFilter === 'all' || task.type === typeFilter);
  });

  const getTypeName = (type: string) => {
    switch(type) {
      case 'repair': return '抢修任务';
      case 'maintenance': return '维修任务';
      case 'alarm': return '消警任务';
      default: return type;
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-yellow-500';
      case 'processing': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const handleStatusChange = (id: string, status: 'pending' | 'processing' | 'completed' | 'rejected') => {
    if (status === 'rejected' && !rejectReason) {
      toast.error('请填写退回原因');
      return;
    }
    
    setTasks(tasks.map(task => 
      task.id === id ? {
        ...task, 
        status,
        ...(status === 'rejected' ? { rejectReason } : {}),
        ...(status === 'completed' ? { actualEnd: new Date().toISOString() } : {})
      } : task
    ));
    toast.success('任务状态已更新');
    setRejectReason('');
  };

  const handleExport = () => {
    const dataToExport = tasks.map(task => ({
      任务编号: task.taskNo,
      任务名称: task.name,
      任务类型: getTypeName(task.type),
      计划时间: `${task.plannedStart} ~ ${task.plannedEnd}`,
      实际时间: task.actualStart ? `${task.actualStart} ~ ${task.actualEnd || '进行中'}` : '-',
      充电站: task.station,
      状态: task.status === 'pending' ? '待处理' : 
            task.status === 'processing' ? '处理中' : 
            task.status === 'completed' ? '已完成' : '已退回',
      描述: task.description,
      负责人: task.assignee,
      提交人: task.submitter,
      提交时间: task.submitTime,
      退回原因: task.rejectReason || '-'
    }));
    
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "任务数据");
    XLSX.writeFile(wb, "任务管理.xlsx");
    toast.success('导出成功');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">任务管理</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => {
              setCurrentTask(null);
              setIsFormOpen(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            新增任务
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            导出Excel
          </button>
        </div>
      </div>

      <div className="flex space-x-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">全部状态</option>
          <option value="pending">待处理</option>
          <option value="processing">处理中</option>
          <option value="completed">已完成</option>
          <option value="rejected">已退回</option>
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">全部类型</option>
          <option value="repair">抢修任务</option>
          <option value="maintenance">维修任务</option>
          <option value="alarm">消警任务</option>
        </select>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">任务编号</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">任务名称</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">任务类型</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">计划时间</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">实际时间</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">充电站</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTasks.map(task => (
              <tr key={task.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{task.taskNo}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{task.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getTypeName(task.type)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {task.plannedStart} ~ {task.plannedEnd}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {task.actualStart ? `${task.actualStart} ~ ${task.actualEnd || '进行中'}` : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.station}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(task.status)} text-white`}>
                    {task.status === 'pending' ? '待处理' : 
                     task.status === 'processing' ? '处理中' : 
                     task.status === 'completed' ? '已完成' : '已退回'}
                  </span>
                  {task.rejectReason && (
                    <div className="text-xs text-red-500 mt-1">原因: {task.rejectReason}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-2">
                  <button
                    onClick={() => {
                      setCurrentTask(task);
                      setIsFormOpen(true);
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    查看
                  </button>
                  {task.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleStatusChange(task.id, 'processing')}
                        className="text-green-600 hover:text-green-800"
                      >
                        开始处理
                      </button>
                      <button
                        onClick={() => {
                          const reason = prompt('请输入退回原因');
                          if (reason) {
                            setRejectReason(reason);
                            handleStatusChange(task.id, 'rejected');
                          }
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        退回
                      </button>
                    </>
                  )}
                  {task.status === 'processing' && (
                    <button
                      onClick={() => handleStatusChange(task.id, 'completed')}
                      className="text-green-600 hover:text-green-800"
                    >
                      完成
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 任务表单弹窗 */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold">{currentTask ? '任务详情' : '新增任务'}</h2>
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
              const task = {
                id: currentTask?.id || Date.now().toString(),
                taskNo: formData.get('taskNo') as string,
                name: formData.get('name') as string,
                type: formData.get('type') as 'repair' | 'maintenance' | 'alarm',
                plannedStart: formData.get('plannedStart') as string,
                plannedEnd: formData.get('plannedEnd') as string,
                station: formData.get('station') as string,
                description: formData.get('description') as string,
                assignee: formData.get('assignee') as string,
                submitter: formData.get('submitter') as string,
                submitTime: currentTask?.submitTime || new Date().toISOString(),
                status: 'pending'
              };
              if (currentTask) {
                setTasks(tasks.map(t => t.id === currentTask.id ? task : t));
              } else {
                setTasks([...tasks, task]);
              }
              setIsFormOpen(false);
              toast.success(currentTask ? '更新成功' : '添加成功');
            }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">任务编号*</label>
                    <input
                      name="taskNo"
                      type="text"
                      defaultValue={currentTask?.taskNo || `T${new Date().getTime()}`}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">任务名称*</label>
                    <input
                      name="name"
                      type="text"
                      defaultValue={currentTask?.name || ''}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">任务类型*</label>
                    <select
                      name="type"
                      defaultValue={currentTask?.type || 'repair'}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="repair">抢修任务</option>
                      <option value="maintenance">维修任务</option>
                      <option value="alarm">消警任务</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">计划开始时间*</label>
                    <input
                      name="plannedStart"
                      type="datetime-local"
                      defaultValue={currentTask?.plannedStart || ''}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">计划结束时间*</label>
                    <input
                      name="plannedEnd"
                      type="datetime-local"
                      defaultValue={currentTask?.plannedEnd || ''}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">充电站*</label>
                    <input
                      name="station"
                      type="text"
                      defaultValue={currentTask?.station || ''}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">负责人*</label>
                    <input
                      name="assignee"
                      type="text"
                      defaultValue={currentTask?.assignee || ''}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">提交人*</label>
                    <input
                      name="submitter"
                      type="text"
                      defaultValue={currentTask?.submitter || ''}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">任务描述*</label>
                <textarea
                  name="description"
                  rows={3}
                  defaultValue={currentTask?.description || ''}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
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
