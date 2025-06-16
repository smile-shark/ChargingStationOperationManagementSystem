import { useState } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { cn } from '@/lib/utils';
import { mockHeatMapData, mockRegionData, mockTags, mockRetentionData } from '@/lib/mockData';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function CustomerAnalysis() {
  const [activeTab, setActiveTab] = useState<'heatmap' | 'map' | 'tags' | 'retention'>('heatmap');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  // 处理标签点击
  const handleTagClick = (tag: string) => {
    setSelectedTag(tag === selectedTag ? null : tag);
  };

  // 处理地图区域点击
  const handleRegionClick = (region: string) => {
    setSelectedRegion(region === selectedRegion ? null : region);
  };

  // 过滤后的热力图数据
  const filteredHeatMapData = mockHeatMapData.filter(
    item => !selectedTag || item.tags?.includes(selectedTag)
  );

  // 过滤后的区域数据
  const filteredRegionData = mockRegionData.filter(
    item => !selectedRegion || item.region === selectedRegion
  );

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">客户行为分析</h1>

      {/* 导航标签 */}
      <div className="flex border-b border-gray-200">
        {['heatmap', 'map', 'tags', 'retention'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={cn(
              'px-4 py-2 font-medium',
              activeTab === tab
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            )}
          >
            {tab === 'heatmap' ? '充电时段' : 
             tab === 'map' ? '客户分布' : 
             tab === 'tags' ? '偏好标签' : '留存分析'}
          </button>
        ))}
      </div>

      {/* 充电时段热力图 */}
      {activeTab === 'heatmap' && (
        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
          <h2 className="text-xl font-semibold mb-4">充电时段热力图</h2>
          <div className="h-96 flex items-center justify-center">
            <div className="text-gray-500">热力图功能暂不可用</div>
          </div>
        </div>
      )}

      {/* 客户分布地图 */}
      {activeTab === 'map' && (
        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
          <h2 className="text-xl font-semibold mb-4">客户分布地图</h2>
          <div className="h-96 flex items-center justify-center">
            <div className="text-gray-500">地图功能暂不可用</div>
          </div>
        </div>
      )}

      {/* 偏好标签云 */}
      {activeTab === 'tags' && (
        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
          <h2 className="text-xl font-semibold mb-4">客户偏好标签云</h2>
          <div className="h-96 flex items-center justify-center">
            <div className="tag-cloud">
              {mockTags.map((tag, index) => (
                <span
                  key={tag.name}
                  onClick={() => handleTagClick(tag.name)}
                  className={cn(
                    'inline-block mx-2 my-1 px-3 py-1 rounded-full cursor-pointer transition-all duration-300 hover:scale-110',
                    tag.name === selectedTag 
                      ? 'bg-blue-600 text-white' 
                      : `bg-${COLORS[index % COLORS.length]}/10 text-${COLORS[index % COLORS.length]}/80`
                  )}
                  style={{
                    fontSize: `${0.8 + tag.value * 0.02}rem`,
                    opacity: tag.name === selectedTag ? 1 : 0.7,
                    transform: tag.name === selectedTag ? 'scale(1.2)' : 'scale(1)'
                  }}
                >
                  {tag.name} ({tag.value})
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 留存率漏斗图 */}
      {activeTab === 'retention' && (
        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
          <h2 className="text-xl font-semibold mb-4">客户留存率漏斗图</h2>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart
                margin={{ top: 20, right: 20, bottom: 30, left: 40 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="step" 
                  name="步骤" 
                  type="category"
                  tickFormatter={(value) => mockRetentionData.find(d => d.step === value)?.label || value}
                />
                <YAxis 
                  dataKey="value" 
                  name="留存率(%)" 
                  domain={[0, 100]}
                />
                <Tooltip 
                  formatter={(value: number) => [`${value}%`, '留存率']}
                  labelFormatter={(label) => mockRetentionData.find(d => d.step === label)?.label || label}
                />
                <Legend />
                <Scatter name="留存率" data={mockRetentionData}>
                  {mockRetentionData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
