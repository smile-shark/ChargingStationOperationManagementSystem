import axiosT from "axios";
import path from "./path";
import { ChargingStation, ChargingPile } from "../types";

const axios = axiosT.create({
  baseURL:'/api',
  timeout: 60 * 1000,
});

axios.interceptors.request.use(
    config => {
        const jwtToken = localStorage.getItem('token')
        if (jwtToken) {
            config.headers['Authorization'] = jwtToken
        }
        return config;
    },
    error => {
        return Promise.reject(error)
    }
);
axios.interceptors.response.use(
    config=>{
        if(config.data.code==401){
            setTimeout(()=>{
                localStorage.removeItem('token')
            },1000)
        }
        return config
    },
    error => {
        return Promise.reject(error)
    }
)



interface ApiResponse<T> {
  code: number;
  msg?: string;
  data: T;
}

interface PageResponse<T> {
  records: T[];
  total: number;
  pages: number;
  current: number;
  size: number;
}

const api = {
  // 充电站相关接口
  chargingStation_simpleList: () => {
    return axios.get<ApiResponse<ChargingStation[]>>(path.chargingStation.simpleList);
  },
  chargingStation_count: () => {
    return axios.get<ApiResponse<number>>(path.chargingStation.count);
  },
  chargingStation_list: (page: number, size: number) => {
    return axios.get<ApiResponse<PageResponse<ChargingStation>>>(path.chargingStation.list, {
      params: {
        page,
        size
      }
    });
  },
  chargingStation_add: (data: Omit<ChargingStation, 'chargingStationId'>) => {
    return axios.post<ApiResponse<ChargingStation>>(path.chargingStation.add, data);
  },
  chargingStation_update: (id: string, data: Partial<ChargingStation>) => {
    return axios.put<ApiResponse<ChargingStation>>(`${path.chargingStation.update}/${id}`, data);
  },
  chargingStation_delete: (id: string) => {
    return axios.delete<ApiResponse<boolean>>(`${path.chargingStation.delete}/${id}`);
  },

  // 充电桩相关接口
  chargingPile_count: () => {
    return axios.get<ApiResponse<number>>(path.chargingPile.count);
  },
  chargingPile_list: (page: number, size: number) => {
    return axios.get<ApiResponse<PageResponse<ChargingPile>>>(path.chargingPile.list, {
      params: {
        page,
        size
      }
    });
  },
  chargingPile_listByStation: (stationId: string) => {
    return axios.get<ApiResponse<ChargingPile[]>>(`${path.chargingPile.list}`, {
      params: {
        stationId
      }
    });
  },
  chargingPile_add: (data: Omit<ChargingPile, 'chargingPileId'>) => {
    return axios.post<ApiResponse<ChargingPile>>(path.chargingPile.add, data);
  },
  chargingPile_update: (id: string, data: Partial<ChargingPile>) => {
    return axios.put<ApiResponse<ChargingPile>>(`${path.chargingPile.update}/${id}`, data);
  },
  chargingPile_delete: (id: string) => {
    return axios.delete<ApiResponse<boolean>>(`${path.chargingPile.delete}/${id}`);
  }
}
export default api;