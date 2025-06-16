import { useState, useMemo } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface FeeRule {
  id: string;
  startTime: string;
  endTime: string;
  price: number;
}



interface Template {
  id: string;
  name: string;
  rules: FeeRule[];
}

interface Holiday {
  id: string;
  date: string;
  name: string;
  rules: FeeRule[];
}

export default function FeeRules() {
  const [activeTab, setActiveTab] = useState<'templates' | 'holidays' | 'simulator'>('templates');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentRule, setCurrentRule] = useState<FeeRule | null>(null);
  const [templates, setTemplates] = useState<Template[]>([
    {
      id: '1',
      name: '工作日标准',
      rules: [

        { id: '1', startTime: '08:00', endTime: '12:00', price: 1.5 },
        { id: '2', startTime: '12:00', endTime: '18:00', price: 2.0 },
        { id: '3', startTime: '18:00', endTime: '22:00', price: 1.8 },
      ],
    },
    {
      id: '2',
      name: '周末标准',
      rules: [
        { id: '4', startTime: '08:00', endTime: '18:00', price: 1.6 },
      ],
    },
  ]);

  const [holidays, setHolidays] = useState<Holiday[]>([
    {
      id: '1',
      date: '2025-01-01',
      name: '元旦',
      rules: [
        { id: '5', startTime: '00:00', endTime: '24:00', price: 1.2 },
      ],
    },
    {
      id: '2',
      date: '2025-02-10',
      name: '春节',
      rules: [
        { id: '6', startTime: '00:00', endTime: '24:00', price: 1.0 },
      ],
    },
  ]);

  const [simulatorInput, setSimulatorInput] = useState({
    power: 7,
    duration: 60,
    startTime: '08:00',
    date: new Date().toISOString().split('T')[0],
  });

  const [simulatorResult, setSimulatorResult] = useState<number | null>(null);

  // 检查规则冲突
  const checkConflict = (rules: FeeRule[], newRule: FeeRule) => {
    return rules.some(rule => {
      if (rule.id === newRule.id) return false;
      return (
        (newRule.startTime >= rule.startTime && newRule.startTime < rule.endTime) ||
        (newRule.endTime > rule.startTime && newRule.endTime <= rule.endTime) ||
        (newRule.startTime <= rule.startTime && newRule.endTime >= rule.endTime)
      );
    });
  };

  // 计算费用
  const calculateFee = () => {
    const { power, duration, startTime, date } = simulatorInput;
    const endTime = new Date(new Date(`${date} ${startTime}`).getTime() + duration * 60000)
      .toTimeString()
      .slice(0, 5);

    // 检查是否是节假日
    const holiday = holidays.find(h => h.date === date);
    const rules = holiday ? holiday.rules : 
      templates.find(t => t.name.includes('周末') ? isWeekend(date) : !isWeekend(date))?.rules || [];

    let total = 0;
    let currentTime = startTime;

    while (currentTime < endTime) {
      const rule = rules.find(r => currentTime >= r.startTime && currentTime < r.endTime);
      if (!rule) break;

      const ruleEndTime = rule.endTime > endTime ? endTime : rule.endTime;
      const hours = (new Date(`${date} ${ruleEndTime}`).getTime() - 
                   new Date(`${date} ${currentTime}`).getTime()) / 3600000;
      
      total += hours * power * rule.price;
      currentTime = ruleEndTime;
    }

    setSimulatorResult(parseFloat(total.toFixed(2)));
  };

  // 判断是否是周末
  const isWeekend = (date: string) => {
    const day = new Date(date).getDay();
    return day === 0 || day === 6;
  };

  // 处理模板拖拽
  const handleTemplateDragEnd = (result: any) => {
    if (!result.destination) return;
    const items = Array.from(templates);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setTemplates(items);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">动态计费规则</h1>

      {/* 标签页 */}
      <div className="flex border-b border-gray-200">
        {['templates', 'holidays', 'simulator'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as 'templates' | 'holidays' | 'simulator')}
            className={cn(
              'px-4 py-2 font-medium',
              activeTab === tab
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            )}
          >
            {tab === 'templates' ? '分时计价模板' : 
             tab === 'holidays' ? '节假日费率' : '规则模拟试算'}
          </button>
        ))}
      </div>

      {/* 分时计价模板 */}
      {activeTab === 'templates' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">分时计价模板库</h2>
            <button
              onClick={() => {
                const newTemplate = {
                  id: Date.now().toString(),
                  name: `新模板${templates.length + 1}`,
                  rules: [],
                };
                setTemplates([...templates, newTemplate]);
                toast.success('模板已添加');
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              新增模板
            </button>
          </div>

          <DragDropContext onDragEnd={handleTemplateDragEnd}>
            <Droppable droppableId="templates" direction="horizontal">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {templates.map((template, index) => (
                    <Draggable key={template.id} draggableId={template.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all"
                        >
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold">{template.name}</h3>
                            <div className="space-x-2">
                              <button
                                onClick={() => {
                                  const newName = prompt('输入新模板名称', template.name);
                                  if (newName) {
                                    setTemplates(templates.map(t => 
                                      t.id === template.id ? {...t, name: newName} : t
                                    ));
                                  }
                                }}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <i className="fas fa-edit"></i>
                              </button>
                              <button
                                onClick={() => {
                                  setTemplates(templates.filter(t => t.id !== template.id));
                                  toast.success('模板已删除');
                                }}
                                className="text-red-600 hover:text-red-800"
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </div>
                          </div>

                          <div className="space-y-4">
                            {template.rules.length > 0 ? (
                              <div className="h-40">
                                <ResponsiveContainer width="100%" height="100%">
                                  <LineChart data={template.rules}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis 
                                      dataKey="startTime" 
                                      tickFormatter={(value) => value.split(':')[0] + '时'}
                                    />
                                    <YAxis />
                                    <Tooltip />
                                    <Line
                                      type="monotone"
                                      dataKey="price"
                                      stroke="#1890FF"
                                      strokeWidth={2}
                                      dot={{ r: 4 }}
                                      activeDot={{ r: 6 }}
                                    />
                                  </LineChart>
                                </ResponsiveContainer>
                              </div>
                            ) : (
                              <div className="h-40 flex items-center justify-center text-gray-400">
                                暂无计费规则
                              </div>
                            )}

                            <div className="space-y-2">
                              {template.rules.map((rule) => (
                                <div key={rule.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                  <span>
                                    {rule.startTime}-{rule.endTime}: ¥{rule.price}/kWh
                                  </span>
                                  <div className="space-x-2">
                                    <button
                                       onClick={() => {
                                const newStart = prompt('开始时间', rule.startTime);
                                const newEnd = prompt('结束时间', rule.endTime);
                                const newPrice = prompt('价格', rule.price.toString());
                                
                                if (newStart && newEnd && newPrice) {
                                  const updatedRule = {
                                    ...rule,
                                    startTime: newStart,
                                    endTime: newEnd,
                                    price: parseFloat(newPrice),
                                  };

                                          if (checkConflict(
                                            template.rules.filter(r => r.id !== rule.id),
                                            updatedRule
                                          )) {
                                            toast.error('时间区间与其他规则冲突');
                                            return;
                                          }
                                          
                                          setTemplates(templates.map(t => 
                                            t.id === template.id ? {
                                              ...t,
                                              rules: t.rules.map(r => 
                                                r.id === rule.id ? updatedRule : r
                                              )
                                            } : t
                                          ));
                                        }
                                      }}
                                      className="text-blue-600 hover:text-blue-800"
                                    >
                                      <i className="fas fa-edit"></i>
                                    </button>
                                    <button
                                      onClick={() => {
                                        setTemplates(templates.map(t => 
                                          t.id === template.id ? {
                                            ...t,
                                            rules: t.rules.filter(r => r.id !== rule.id)
                                          } : t
                                        ));
                                      }}
                                      className="text-red-600 hover:text-red-800"
                                    >
                                      <i className="fas fa-trash"></i>
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>

                            <button
                              onClick={() => {
                                const newRule = {
                                  id: Date.now().toString(),
                                  startTime: '00:00',
                                  endTime: '01:00',
                                  price: 1.0,
                                };
                                setTemplates(templates.map(t => 
                                  t.id === template.id ? {
                                    ...t,
                                    rules: [...t.rules, newRule]
                                  } : t
                                ));
                              }}
                              className="w-full py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
                            >
                              添加规则
                            </button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      )}

      {/* 节假日费率 */}
      {activeTab === 'holidays' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">节假日特殊费率设置</h2>
            <button
              onClick={() => {
                const newHoliday = {
                  id: Date.now().toString(),
                  date: new Date().toISOString().split('T')[0],
                  name: '新节假日',
                  rules: [],
                };
                setHolidays([...holidays, newHoliday]);
                toast.success('节假日已添加');
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              新增节假日
            </button>
          </div>

          <div className="space-y-4">
            {holidays.map((holiday) => (
              <div key={holiday.id} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="font-semibold">{holiday.name}</h3>
                    <p className="text-sm text-gray-500">{holiday.date}</p>
                  </div>
                  <div className="space-x-2">
                    <button
                      onClick={() => {
                        const newName = prompt('节假日名称', holiday.name);
                        const newDate = prompt('日期(YYYY-MM-DD)', holiday.date);
                        if (newName && newDate) {
                          setHolidays(holidays.map(h => 
                            h.id === holiday.id ? {...h, name: newName, date: newDate} : h
                          ));
                        }
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      onClick={() => {
                        setHolidays(holidays.filter(h => h.id !== holiday.id));
                        toast.success('节假日已删除');
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {holiday.rules.length > 0 ? (
                    <div className="h-40">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={holiday.rules}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis 
                            dataKey="startTime" 
                            tickFormatter={(value) => value.split(':')[0] + '时'}
                          />
                          <YAxis />
                          <Tooltip />
                          <Line
                            type="monotone"
                            dataKey="price"
                            stroke="#1890FF"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="h-40 flex items-center justify-center text-gray-400">
                      暂无计费规则
                    </div>
                  )}

                  <div className="space-y-2">
                    {holiday.rules.map((rule) => (
                      <div key={rule.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span>
                          {rule.startTime}-{rule.endTime}: ¥{rule.price}/kWh
                        </span>
                        <div className="space-x-2">
                          <button
                            onClick={() => {
                              const newStart = prompt('开始时间', rule.startTime);
                              const newEnd = prompt('结束时间', rule.endTime);
                              const newPrice = prompt('价格', rule.price.toString());
                              
                              if (newStart && newEnd && newPrice) {
                                const updatedRule = {
                                  ...rule,
                                  startTime: newStart,
                                  endTime: newEnd,
                                  price: parseFloat(newPrice),
                                };
                                
                                if (checkConflict(
                                  holiday.rules.filter(r => r.id !== rule.id),
                                  updatedRule
                                )) {
                                  toast.error('时间区间与其他规则冲突');
                                  return;
                                }
                                
                                setHolidays(holidays.map(h => 
                                  h.id === holiday.id ? {
                                    ...h,
                                    rules: h.rules.map(r => 
                                      r.id === rule.id ? updatedRule : r
                                    )
                                  } : h
                                ));
                              }
                            }}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            onClick={() => {
                              setHolidays(holidays.map(h => 
                                h.id === holiday.id ? {
                                  ...h,
                                  rules: h.rules.filter(r => r.id !== rule.id)
                                } : h
                              ));
                            }}
                            className="text-red-600 hover:text-red-800"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      const newRule = {
                        id: Date.now().toString(),
                        startTime: '00:00',
                        endTime: '24:00',
                        price: 1.0,
                      };
                      setHolidays(holidays.map(h => 
                        h.id === holiday.id ? {
                          ...h,
                          rules: [...h.rules, newRule]
                        } : h
                      ));
                    }}
                    className="w-full py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
                  >
                    添加规则
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 规则模拟试算 */}
      {activeTab === 'simulator' && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">规则模拟试算器</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-medium mb-4">输入参数</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">充电功率(kW)</label>
                  <input
                    type="number"
                    min="1"
                    value={simulatorInput.power}
                    onChange={(e) => setSimulatorInput({
                      ...simulatorInput,
                      power: parseInt(e.target.value) || 0
                    })}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">充电时长(分钟)</label>
                  <input
                    type="number"
                    min="1"
                    value={simulatorInput.duration}
                    onChange={(e) => setSimulatorInput({
                      ...simulatorInput,
                      duration: parseInt(e.target.value) || 0
                    })}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">开始时间</label>
                  <input
                    type="time"
                    value={simulatorInput.startTime}
                    onChange={(e) => setSimulatorInput({
                      ...simulatorInput,
                      startTime: e.target.value
                    })}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">日期</label>
                  <input
                    type="date"
                    value={simulatorInput.date}
                    onChange={(e) => setSimulatorInput({
                      ...simulatorInput,
                      date: e.target.value
                    })}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <button
                  onClick={calculateFee}
                  className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  计算费用
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-medium mb-4">计算结果</h3>
              {simulatorResult !== null ? (
                <div className="space-y-4">
                  <div className="text-3xl font-bold text-blue-600">
                    ¥{simulatorResult}
                  </div>
                  <div className="text-sm text-gray-500">
                    <p>功率: {simulatorInput.power}kW</p>
                    <p>时长: {simulatorInput.duration}分钟</p>
                    <p>开始时间: {simulatorInput.startTime}</p>
                    <p>日期: {simulatorInput.date}</p>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400">
                  请输入参数并点击计算
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
