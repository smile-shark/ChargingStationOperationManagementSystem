import React, { useEffect, useRef, useState } from "react";
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { LatLngExpression, Map } from 'leaflet';
import { ChargingStation } from "@/entity/ChargingStation";

interface MapProps {
  chargingStations: ChargingStation[];
  selectedStation?: ChargingStation | null;
  onPopupClick?: (station: ChargingStation) => void;
}

export default function MyMap({ 
  chargingStations, 
  selectedStation, 
  onPopupClick 
}: MapProps) {
    const [selectedMarker, setSelectedMarker] = useState<ChargingStation | null>(null);
    const mapRef = useRef<Map | null>(null);
    // 默认中心点（北京）
    const defaultCenter: LatLngExpression = [39.9042, 116.4074];

    // 检查第一个充电站坐标是否有效
    const firstStation = chargingStations?.[0];
    const center: LatLngExpression = 
        firstStation && firstStation.x && firstStation.y 
            ? [firstStation.y, firstStation.x] 
            : defaultCenter;

    // 当selectedStation变化时移动地图
    useEffect(() => {
        if (selectedStation && mapRef.current) {
            mapRef.current.flyTo([selectedStation.y, selectedStation.x], 15);
        }
    }, [selectedStation]);

    if (!chargingStations || chargingStations.length === 0) {
        return (
            <div style={{border: '1px solid black'}}>
                <MapContainer 
                    center={defaultCenter} 
                    zoom={13} 
                    style={{ height: '100vh', width: '100%' }}
                    ref={(map) => mapRef.current = map}
                >
                    <TileLayer
                        attribution='&copy; OpenStreetMap contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                </MapContainer>
            </div>
        );
    }

    return (
        <div style={{border: '1px solid black'}}>
            <MapContainer 
                center={center} 
                zoom={13} 
                style={{ height: '100vh', width: '100%' }}
                ref={(map) => mapRef.current = map}
            >
                <TileLayer
                    attribution='&copy; OpenStreetMap contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {chargingStations.map(station => (
                    <Marker 
                        key={station.chargingStationId} 
                        position={[station.y, station.x]}
                        eventHandlers={{
                            click: () => setSelectedMarker(station)
                        }}
                    >
                        <Popup>
                            <strong>{station.name}</strong><br />
                            坐标: ({station.x}, {station.y})<br />
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onPopupClick && onPopupClick(station);
                                }}
                                className="text-blue-500 hover:underline"
                            >
                                查看详情
                            </button>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}