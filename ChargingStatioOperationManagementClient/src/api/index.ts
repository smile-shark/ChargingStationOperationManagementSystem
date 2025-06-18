import axiosT from "axios";
import path from "./path";
import { ChargingStation } from "@/types";

const axios = axiosT.create({
  baseURL: '/api',
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
  config => {
    if (config.data.code == 401) {
      setTimeout(() => {
        localStorage.removeItem('token')
      }, 1000)
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)



const api = {
  // 充电站相关接口
  chargingStation_simpleList: () => {
    return axios.get(path.chargingStation.simpleList);
  },
  chargingStation_count: () => {
    return axios.get(path.chargingStation.count);
  },
  chargingStation_list: (page: number, size: number) => {
    return axios.get(path.chargingStation.list, {
      params: {
        page,
        size
      }
    });
  },
  chargingStation_add: (data: ChargingStation) => {
    return axios.post(path.chargingStation.add, data);
  },
  chargingStation_update: (id: string, data: ChargingStation) => {
    return axios.put(`${path.chargingStation.update}/${id}`, data);
  },
  chargingStation_delete: (id: string) => {
    return axios.delete(path.chargingStation.delete, {
      params: {
        id
      }
    });
  },

  // 充电桩相关接口
  chargingPile_count: () => {
    return axios.get(path.chargingPile.count);
  },
  chargingPile_list: (page: number, size: number) => {
    return axios.get(path.chargingPile.list, {
      params: {
        page,
        size
      }
    });
  },
  
  // 文件上传接口
  upload_file: (formData: FormData) => {
    return axios.post(path.util.uploadImage, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
}
export default api;