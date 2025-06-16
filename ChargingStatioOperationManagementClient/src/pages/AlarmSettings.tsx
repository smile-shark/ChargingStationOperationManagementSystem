import { useState } from 'react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';

interface AlarmParameter {
  id: string;
  name: string;
  unit: string;
  category: 'voltage' | 'current' | 'temperature' | 'other';
  warnThreshold: number;
  errorThreshold: number;
  delay: number;
  min: number;
  max: number;
}

const mockParameters: AlarmParameter[] = [
  // 电压参数
  { id: '1', name: 'A相电压', unit: 'V', category: 'voltage', warnThreshold: 240, errorThreshold: 250, delay: 5, min: 0, max: 300 },
  { id: '2', name: 'B相电压', unit: 'V', category: 'voltage', warnThreshold: 240, errorThreshold: 250, delay: 5, min: 0, max: 300 },
  { id: '3', name: 'C相电压', unit: 'V', category: 'voltage', warnThreshold: 240, errorThreshold: 250, delay: 5, min: 0, max: 300 },
  
  // 电流参数
  { id: '4', name: 'A相电流', unit: 'A', category: 'current', warnThreshold: 60, errorThreshold: 80, delay: 3, min: 0, max: 100 },
  { id: '5', name: 'B相电流', unit: 'A', category: 'current', warnThreshold: 60, errorThreshold: 80, delay: 3, min: 0, max: 100 },
  { id: '6', name: 'C相电流', unit: 'A', category: 'current', warnThreshold: 60, errorThreshold: 80, delay: 3, min: 0, max: 100 },
  
  // 温度参数
  { id: '7', name: '环境温度', unit: '°C', category: 'temperature', warnThreshold: 45, errorThreshold: 60, delay: 10, min: -20, max: 80 },
  { id: '8', name: '充电枪温度', unit: '°C', category: 'temperature', warnThreshold: 65, errorThreshold: 80, delay: 5, min: -20, max: 100 },
  { id: '9', name: '充电模块温度', unit: '°C', category: 'temperature', warnThreshold: 70, errorThreshold: 85, delay: 5, min: -20, max: 100 },
  
  // 其他参数
  { id: '10', name: '绝缘电阻', unit: 'MΩ', category: 'other', warnThreshold: 0.5, errorThreshold: 0.1, delay: 2, min: 0, max: 10 },
  { id: '11', name: '漏电流', unit: 'mA', category: 'other', warnThreshold: 30, errorThreshold: 50, delay: 2, min: 0, max: 100 },
];

export default function AlarmSettings() {
  const [activeCategory, setActiveCategory] = useState<'voltage' | 'current' | 'temperature' | 'other'>('voltage');
  const [parameters, setParameters] = useState<AlarmParameter[]>(mockParameters);
  const [selectedPiles, setSelectedPiles] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredParameters = parameters.filter(p => 
    p.category === activeCategory && 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleThresholdChange = (id: string, type: 'warn' | 'error', value: number) => {
    setParameters(parameters.map(p => 
      p.id === id 
        ? type === 'warn' 
          ? {...p, warnThreshold: value} 
          : {...p, errorThreshold: value}
        : p
    ));
  };

  const handleDelayChange = (id: string, value: number) => {
    setParameters(parameters.map(p => 
      p.id === id ? {...p, delay: value} : p
    ));
  };

  const handleApplyAll = () => {
    if (selectedPiles.length === 0) {
      toast.warning('请至少选择一个充电桩');
      return;
    }
    toast.success(`已成功应用阈值设置到 ${selectedPiles.length} 个充电桩`);
  };

  const handleExport = () => {
    const dataToExport = parameters.map(param => ({
      参数名称: param.name,
      单位: param.unit,
      类别: param.category === 'voltage' ? '电压' : 
           param.category === 'current' ? '电流' : 
           param.category === 'temperature' ? '温度' : '其他',
      警告阈值: param.warnThreshold,
      严重阈值: param.errorThreshold,
      报警延时: param.delay
    }));
    
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "报警设置");
    XLSX.writeFile(wb, "报警设置.xlsx");
    toast.success('导出成功');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">报警阈值设置</h1>
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          导出设置
        </button>
      </div>

      <div className="flex space-x-4">
        <input
          type="text"
          placeholder="搜索参数..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        <select
          value={activeCategory}
          onChange={(e) => setActiveCategory(e.target.value as any)}
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="voltage">电压参数</option>
          <option value="current">电流参数</option>
          <option value="temperature">温度参数</option>
          <option value="other">其他参数</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredParameters.map((param) => (
          <div key={param.id} className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-medium">{param.name} ({param.unit})</h3>
            
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  警告阈值 ({param.unit})
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    min={param.min}
                    max={param.max}
                    value={param.warnThreshold}
                    onChange={(e) => handleThresholdChange(param.id, 'warn', parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <input
                    type="number"
                    value={param.warnThreshold}
                    onChange={(e) => handleThresholdChange(param.id, 'warn', parseFloat(e.target.value))}
                    className="w-16 px-2 py-1 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  严重阈值 ({param.unit})
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    min={param.min}
                    max={param.max}
                    value={param.errorThreshold}
                    onChange={(e) => handleThresholdChange(param.id, 'error', parseFloat(e.target.value))}
                    className="w-full h-2 bg-red-100 rounded-lg appearance-none cursor-pointer"
                  />
                  <input
                    type="number"
                    value={param.errorThreshold}
                    onChange={(e) => handleThresholdChange(param.id, 'error', parseFloat(e.target.value))}
                    className="w-16 px-2 py-1 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  报警延时 (秒)
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    min="1"
                    max="30"
                    value={param.delay}
                    onChange={(e) => handleDelayChange(param.id, parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <input
                    type="number"
                    value={param.delay}
                    onChange={(e) => handleDelayChange(param.id, parseInt(e.target.value))}
                    className="w-16 px-2 py-1 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">批量应用到充电桩</h3>
            <p className="text-sm text-gray-500">选择需要应用设置的充电桩</p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              multiple
              value={selectedPiles}
              onChange={(e) => {
                const options = e.target.options;
                const selected = [];
                for (let i = 0; i < options.length; i++) {
                  if (options[i].selected) {
                    selected.push(options[i].value);
                  }
                }
                setSelectedPiles(selected);
              }}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="P001">P001 - 北京朝阳站</option>
              <option value="P002">P002 - 北京朝阳站</option>
              <option value="P003">P003 - 上海浦东站</option>
              <option value="P004">P004 - 广州天河站</option>
            </select>
            <button
              onClick={handleApplyAll}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              批量应用
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}