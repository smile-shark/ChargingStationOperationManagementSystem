import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Card } from '@/components/Card';
import { mockStationStats } from '@/lib/mockData';
import { useNavigate } from 'react-router-dom';

interface Station {
  id: string;
  name: string;
  lng: number;
  lat: number;
  status: 'normal' | 'warning' | 'error';
  pileCount: number;
  chargingCount: number;
  address: string;
}

export default function Monitor() {
  const navigate = useNavigate();
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isHeatMap, setIsHeatMap] = useState(false);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [hoveredStation, setHoveredStation] = useState<Station | null>(null);

  // Mock数据 - 充电站信息
  const stations: Station[] = [
    { 
      id: '1', 
      name: '北京朝阳充电站', 
      lng: 116.404, 
      lat: 39.915, 
      status: 'normal',
      pileCount: 8,
      chargingCount: 3,
      address: '北京市朝阳区建国路88号'
    },
    { 
      id: '2', 
      name: '上海浦东充电站', 
      lng: 121.48, 
      lat: 31.235, 
      status: 'warning',
      pileCount: 12,
      chargingCount: 7,
      address: '上海市浦东新区张江高科技园区'
    },
    { 
      id: '3', 
      name: '广州天河充电站', 
      lng: 113.33, 
      lat: 23.16, 
      status: 'error',
      pileCount: 6,
      chargingCount: 2,
      address: '广州市天河区体育西路'
    },
    { 
      id: '4', 
      name: '深圳南山充电站', 
      lng: 113.93, 
      lat: 22.53, 
      status: 'normal',
      pileCount: 10,
      chargingCount: 5,
      address: '深圳市南山区科技园'
    },
    { 
      id: '5', 
      name: '成都高新充电站', 
      lng: 104.06, 
      lat: 30.67, 
      status: 'normal',
      pileCount: 6,
      chargingCount: 3,
      address: '成都市高新区天府大道'
    },
  ];

  // 过滤后的站点
  const filteredStations = useMemo(() => {
    return stations.filter(station => 
      station.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, stations]);

  // 获取状态对应的颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return '#52c41a';
      case 'warning': return '#faad14';
      case 'error': return '#f5222d';
      default: return '#1890ff';
    }
  };

  const handleStationClick = (station: Station) => {
    navigate(`/station/${station.id}`);
  };

  const handlePilesClick = () => {
    navigate('/station-pile/piles');
  };

  // 生成地图图片URL
  const mapImagePrompt = encodeURIComponent('中国地图，标注主要城市位置，简洁风格，白色背景');
  const mapImageUrl = `https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=%24%7BmapImagePrompt%7D&sign=6d1a8a54b336c7208e58e73ef4f3d04d`;

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* 统计卡片 */}
      <div className="absolute top-4 right-4 z-10 flex space-x-4">
        <Card 
          title="充电站总数" 
          value={mockStationStats.totalStations} 
          growth={0}
          icon="charging-station"
          onClick={() => navigate('/station-pile/stations')}
        />
        <Card 
          title="充电桩总数" 
          value={mockStationStats.totalPiles} 
          growth={0}
          icon="plug"
          onClick={handlePilesClick}
        />
      </div>

      {/* 地图图片容器 */}
      <div className="relative h-full w-full">
        <img 
          src={mapImageUrl}
          alt="充电站分布地图"
          className="w-full h-full object-cover"
        />
        
        {/* 充电站标记 */}
        {filteredStations.map(station => (
          <div
            key={station.id}
            className="absolute cursor-pointer"
            style={{
              left: `${((station.lng - 100) / 30) * 100}%`,
              top: `${((40 - station.lat) / 30) * 100}%`,
              transform: 'translate(-50%, -50%)'
            }}
            onClick={() => handleStationClick(station)}
            onMouseEnter={() => setHoveredStation(station)}
            onMouseLeave={() => setHoveredStation(null)}
          >
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold shadow-lg"
              style={{ backgroundColor: getStatusColor(station.status) }}
            >
              {station.name.charAt(0)}
            </div>
          </div>
        ))}
      </div>

      {/* 悬浮信息框 */}
      {hoveredStation && (
        <div 
          className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 bg-white p-4 rounded-lg shadow-lg max-w-xs"
          style={{
            filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.15))'
          }}
        >
          <h3 className="font-bold">{hoveredStation.name}</h3>
          <p className="text-sm text-gray-600">{hoveredStation.address}</p>
          <div className="mt-2 flex justify-between text-sm">
            <span>充电桩: {hoveredStation.pileCount}</span>
            <span>使用中: {hoveredStation.chargingCount}</span>
          </div>
          <div 
            className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white"
            style={{
              clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)'
            }}
          />
        </div>
      )}

      {/* 左侧搜索面板 */}
      <div className={cn(
        "absolute top-4 left-4 z-10 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg transition-all duration-300",
        isPanelOpen ? "w-64 p-4" : "w-12 h-12"
      )}>
        {isPanelOpen ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">充电站搜索</h2>
              <button 
                onClick={() => setIsPanelOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <i className="fas fa-chevron-left"></i>
              </button>
            </div>
            
            <input
              type="text"
              placeholder="搜索充电站..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredStations.map(station => (
                 <div 
                  key={station.id}
                  onClick={() => {
                    setSelectedStation(station);
                    navigate(`/station/${station.id}`);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-md cursor-pointer flex items-center"
                >
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: getStatusColor(station.status) }}
                  />
                  <span className="truncate">{station.name}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <button 
            onClick={() => setIsPanelOpen(true)}
            className="w-full h-full flex items-center justify-center text-gray-500 hover:text-gray-700"
          >
            <i className="fas fa-search"></i>
          </button>
        )}
      </div>

      {/* 热力图切换按钮 */}
      <button
        onClick={() => setIsHeatMap(!isHeatMap)}
        className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur-sm p-2 rounded-lg shadow-lg hover:bg-white"
      >
        {isHeatMap ? (
          <i className="fas fa-map-marked-alt text-blue-600"></i>
        ) : (
          <i className="fas fa-fire text-orange-500"></i>
        )}
      </button>
    </div>
  );
}