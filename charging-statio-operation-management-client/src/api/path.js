
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
    allListByChargingStationId: '/chargingPile/allListByChargingStationId',
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
    simpleList:'/operationsPersonnel/simpleList',
    detailList:'/operationsPersonnel/detailList',
    more:'/operationsPersonnel'
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
  },
  chargingRecord:{
    detailList:'/chargingRecord/detailList'
  },
  rechargeRecord:{
    detailList:'/rechargeRecord/detailList'
  },
  transactionFlow:{
    detailList:'/transactionFlow/detailList'
  },
  alarmSet:{
    saveOrUpdate:'/alarmSet/saveOrUpdate'
  },
  alarmMsg:{
    detailList:'/alarmMsg/detailList',
    more:'/alarmMsg'
  },
  task:{
    detailList:'/task/detailList',
    more:'/task'
  },
  admin:{
    login:'/admin/login',
  }
};