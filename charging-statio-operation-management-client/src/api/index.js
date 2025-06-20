import axiosG from "axios";
import path from "./path";
import { data } from "autoprefixer";
import { Message } from "element-ui";
import { del } from "vue";
import { list } from "postcss";

const axios = axiosG.create({
  timeout: 10000,
  baseURL: "/api",
});

axios.interceptors.response.use((config) => {
  if (config.data.code != 200) {
    Message.error(config.data.msg);
  }
  return config;
});

export default {
  chargingStation: {
    simpleList: () => {
      return axios.get(path.chargingStation.simpleList);
    },
    count: () => {
      return axios.get(path.chargingStation.count);
    },
    list: (page, size) => {
      return axios.get(path.chargingStation.list, { params: { page, size } });
    },
    add: (data) => {
      return axios.post(path.chargingStation.more, data);
    },
    update: (data) => {
      return axios.put(path.chargingStation.more, data);
    },
    delete: (id) => {
      return axios.delete(path.chargingStation.more, { params: { id } });
    },
  },
  chargingPile: {
    count: () => {
      return axios.get(path.chargingPile.count);
    },
    list: (page, size) => {
      return axios.get(path.chargingPile.list, { params: { page, size } });
    },
    listByChargingStationId: ({ page, size, chargingStationId } = data) => {
      return axios.get(path.chargingPile.listByChargingStationId, {
        params: { page, size, chargingStationId },
      });
    },
    addOrUpdate: (data) => {
      return axios.post(path.chargingPile.addOrUpdate, data);
    },
    delete: (id) => {
      return axios.delete(path.chargingPile.more, { params: { id } });
    },
    simpleListByChargingStationId: (chargingStationId) => {
      return axios.get(path.chargingPile.simpleListByChargingStationId, {
        params: { chargingStationId },
      });
    },
  },
  operationsPersonnel: {
    simpleList: () => {
      return axios.get(path.operationsPersonnel.simpleList);
    },
  },
  util: {
    uploadImage: (data) => {
      return axios.post(path.util.uploadImage, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
  },
  reservation: {
    list: (page, size, param) => {
      return axios.get(path.reservation.list, {
        params: { page, size, param },
      });
    },
    add: (data) => {
      return axios.post(path.reservation.more, data);
    },
    update: (data) => {
      return axios.put(path.reservation.more, data);
    },
    delete: (id) => {
      return axios.delete(path.reservation.more, { params: { id } });
    },
  },
  user: {
    simpleList: () => {
      return axios.get(path.user.simpleList);
    },
    simpleListNotHaveChargingCard: () => {
      return axios.get(path.user.simpleListNotHaveChargingCard);
    },
    list: (page, size) => {
      return axios.get(path.user.more, { params: { page, size } });
    },
    add: (data) => {
      return axios.post(path.user.more, data);
    },
    update: (data) => {
      return axios.put(path.user.more, data);
    },
    delete: (id) => {
      return axios.delete(path.user.more, { params: { id } });
    },
  },
  car: {
    list: (page, size, param) => {
      return axios.get(path.car.more, { params: { page, size, param } });
    },
    add: (data) => {
      return axios.post(path.car.more, data);
    },
    update: (data) => {
      return axios.put(path.car.more, data);
    },
    delete: (id) => {
      return axios.delete(path.car.more, { params: { id } });
    },
  },
  carM: {
    userIdListByCarId: (carId) => {
      return axios.get(path.carM.userIdListByCarId, { params: { carId } });
    },
  },
  chargingCard: {
    list: (page, size) => {
      return axios.get(path.chargingCard.list, { params: { page, size } });
    },
    add: (data) => {
      return axios.post(path.chargingCard.more, data);
    },
    update: (data) => {
      return axios.put(path.chargingCard.more, data);
    },
    delete: (id) => {
      return axios.delete(path.chargingCard.more, { params: { id } });
    },
  },
  billingRules: {
    detailList: (timeRange) => {
      return axios.get(path.billingRules.detailList, { params: { timeRange:timeRange.join(',') } });
    },
    list:()=>{
      return axios.get(path.billingRules.list)
    },
    add:(data)=>{
      return axios.post(path.billingRules.more,data)
    },
    update:(data)=>{
      return axios.put(path.billingRules.more,data)
    },
    delete:(id)=>{
      return axios.delete(path.billingRules.more,{params:{id}})
    }
  },
};
