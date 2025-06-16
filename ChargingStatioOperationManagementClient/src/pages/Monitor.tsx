import { useState, useMemo, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Card } from '@/components/Card';
import { useNavigate } from 'react-router-dom';
import api from '@/api';
import { ChargingStation } from '@/entity/ChargingStation';
import { use } from 'framer-motion/client';
import Map from '@/components/Map';




export default function Monitor() {
  const navigate = useNavigate();
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isHeatMap, setIsHeatMap] = useState(false);
  const [selectedStation, setSelectedStation] = useState<ChargingStation | null>(null);
  const [hoveredStation, setHoveredStation] = useState<ChargingStation | null>(null);
  const [stations, setStations] = useState<ChargingStation[]>([]);
  const [chargingPileCount, setChargingPileCount] = useState(0);
  const [chargingStationCount, setChargingStationCount] = useState(0);

  // 过滤后的站点
  const filteredStations = useMemo(() => {
    return stations.filter(station =>
      station.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, stations]);

  // 获取站点数据
  useEffect(() => {
    api.chargingStation_simpleList().then(res => {
      if (res.data.code == 200) {
        toast.success(res.data.msg);
        setStations(res.data.data)
        setChargingStationCount(res.data.data.length)
      } else {
        toast.error(res.data.msg);
      }
    })
    api.chargingPile_count().then(res => {
      if (res.data.code == 200) {
        toast.success(res.data.msg);
        setChargingPileCount(res.data.data)
      } else {
        toast.error(res.data.msg);
      }
    })
  },[])

  // 获取状态对应的颜色
  const getStatusColor = (state: number) => {
    switch (state) {
      case 1: return '#52c41a';
      case 0: return '#f5222d';
      default: return '#1890ff';
    }
  };

  const handleStationClick = (station: ChargingStation) => {
    navigate(`/station/${station.chargingStationId}`);
  };

  const handlePilesClick = () => {
    navigate('/station-pile/piles');
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* 统计卡片 */}
      <div className="absolute top-4 right-4 z-20 flex space-x-4">
        <Card
          title="充电站总数"
          value={chargingStationCount}
          growth={0}
          icon="charging-station"
          onClick={() => navigate('/station-pile/stations')}
        />
        <Card
          title="充电桩总数"
          value={chargingPileCount}
          growth={0}
          icon="plug"
          onClick={handlePilesClick}
        />
      </div>

      <div className="relative h-full w-full z-10">
        <Map 
          chargingStations={stations}
          selectedStation={selectedStation}
          onPopupClick={(station) => navigate(`/station/${station.chargingStationId}`)}
        />
      </div>


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
                  key={station.chargingStationId}
                  onClick={() => {
                    setSelectedStation(station);
                    // 不再直接导航，只设置选中状态
                  }}
                  className="p-2 hover:bg-gray-100 rounded-md cursor-pointer flex items-center"
                >
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: getStatusColor(station.state) }}
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
      {/* <button
        onClick={() => setIsHeatMap(!isHeatMap)}
        className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur-sm p-2 rounded-lg shadow-lg hover:bg-white"
      >
        {isHeatMap ? (
          <i className="fas fa-map-marked-alt text-blue-600"></i>
        ) : (
          <i className="fas fa-fire text-orange-500"></i>
        )}
      </button> */}
    </div>
  );
}