
export default {
  chargingStation: {
    simpleList:'/chargingStation/simpleList',
    count:'/chargingStation/count',
    list:'/chargingStation/list',
    more: '/chargingStation',
  },
  chargingPile:{
    count: '/chargingPile/count',
    list: '/chargingPile/list',
    more: '/chargingPile',
    addOrUpdate:'/chargingPile/addOrUpdate',
    listByChargingStationId:'/chargingPile/listByChargingStationId',
    simpleListByChargingStationId:'/chargingPile/simpleListByChargingStationId'
  },
  billingRules:{
    list:'/billingRules/list',
    detailList:'/billingRules/detailList',
    more:'/billingRules'
  },
  util: {
    uploadImage: '/util/uploadImage'
  },
  operationsPersonnel:{
    simpleList:'/operationsPersonnel/simpleList'
  },
  reservation:{
    list:'/reservation/list',
    more:'/reservation'
  },
  user:{
    more:'/user',
    simpleList:'/user/simpleList',
    simpleListNotHaveChargingCard:'/user/simpleListNotHaveChargingCard'
  },
  car:{
    more:'/car'
  },
  carM:{
    userIdListByCarId:'/carM/userIdListByCarId'
  },
  chargingCard:{
    list:'/chargingCard/list',
    more:'/chargingCard'
  }
};