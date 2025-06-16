/**
 * 充电站类型定义
 */
export interface ChargingStation {
  chargingStationId: string;
  operationsPersonnelId?: string;
  name: string;
  /**
   * 充电站类型
   * 0: 混合小型充电站
   * 1: 混合中型充电站
   * 2: 混合大型充电站
   * 3: 小型汽车充电站
   * 4: 中型汽车充电站
   * 5: 大型汽车充电站
   * 6: 小型电瓶车充电站
   * 7: 中型电瓶车充电站
   * 8: 大型电瓶车充电站
   */
  type: number;
  address: string;
  /**
   * 充电站状态
   * 1: 运营中
   * 0: 停用中
   */
  state: number;
  x: number;
  y: number;
  startTime: string;
  endTime: string;
  picture?: string;
  detail?: string;
  /**
   * 汽车充电桩数量
   */
  carPileCount: number;
  /**
   * 电瓶车充电桩数量
   */
  esPileCount: number;
  /**
   * 公交车充电桩数量
   */
  busPileCount: number;
}

/**
 * 充电桩类型定义
 */
export interface ChargingPile {
  chargingPileId: string;
  chargingStationId: string;
  name: string;
  /**
   * 类别
   * 0: 汽车充电桩
   * 1: 电瓶车充电桩
   * 2: 大型公交车充电桩
   */
  typeC: number;
  /**
   * 类型
   * 0: 混合型(交直流)
   * 1: 直流桩
   * 2: 交流桩
   */
  typeV: number;
  /**
   * 充电枪数量
   */
  chargingGunCount: number;
  /**
   * 功率
   */
  power: number;
  /**
   * 安装位置
   */
  inPosition?: string;
  /**
   * 状态
   * 0: 充电中
   * 1: 空闲
   * 2: 离线
   * 3: 故障
   */
  state: number;
  detail?: string;
  picture?: string;
}

/**
 * 计费规则类型定义
 */
export interface BillingRules {
  billingRulesId: string;
  name: string;
  /**
   * 时间范围
   * 0: 工作日
   * 1-7: 星期一到星期日
   * 8: 周某
   * 9: 节假日
   */
  timeRange: number;
  /**
   * 开始日期(节假日)
   */
  startDate?: string;
  /**
   * 结束日期(节假日)
   */
  endDate?: string;
  /**
   * 优先级
   */
  order: number;
}

/**
 * 计费规则详情类型定义
 */
export interface BillingRulesDetail {
  billingRulesDetailId: string;
  billingRulesId: string;
  /**
   * 开始时间
   */
  startTime: string;
  /**
   * 结束时间
   */
  endTime: string;
  /**
   * 服务费
   */
  serviceFee: number;
  /**
   * 电费
   */
  electricityFee: number;
}

/**
 * 用户类型定义
 */
export interface User {
  userId: string;
  username: string;
  password: string;
  name: string;
  phone: string;
  email?: string;
  /**
   * 用户类型
   * 0: 普通用户
   * 1: 管理员
   */
  type: number;
  /**
   * 状态
   * 0: 禁用
   * 1: 启用
   */
  state: number;
}

/**
 * 充电卡类型定义
 */
export interface ChargingCard {
  chargingCardId: string;
  userId: string;
  /**
   * 卡号
   */
  cardNumber: string;
  /**
   * 余额
   */
  balance: number;
  /**
   * 状态
   * 0: 禁用
   * 1: 启用
   */
  state: number;
}

/**
 * 充电记录类型定义
 */
export interface ChargingRecord {
  chargingRecordId: string;
  chargingPileId: string;
  userId: string;
  /**
   * 开始时间
   */
  startTime: string;
  /**
   * 结束时间
   */
  endTime?: string;
  /**
   * 充电量
   */
  chargingAmount: number;
  /**
   * 服务费
   */
  serviceFee: number;
  /**
   * 电费
   */
  electricityFee: number;
  /**
   * 总费用
   */
  totalFee: number;
  /**
   * 状态
   * 0: 充电中
   * 1: 已完成
   * 2: 已取消
   */
  state: number;
}

/**
 * 预约类型定义
 */
export interface Reservation {
  reservationId: string;
  userId: string;
  chargingStationId: string;
  chargingPileId?: string;
  /**
   * 预约时间
   */
  reservationTime: string;
  /**
   * 预计充电时长(分钟)
   */
  estimatedDuration: number;
  /**
   * 状态
   * 0: 待确认
   * 1: 已确认
   * 2: 已取消
   * 3: 已完成
   */
  state: number;
}

/**
 * 警报消息类型定义
 */
export interface AlarmMsg {
  alarmMsgId: string;
  chargingStationId?: string;
  chargingPileId?: string;
  /**
   * 警报类型
   * 0: 充电桩故障
   * 1: 充电站故障
   * 2: 系统故障
   */
  type: number;
  /**
   * 警报内容
   */
  content: string;
  /**
   * 警报时间
   */
  alarmTime: string;
  /**
   * 状态
   * 0: 未处理
   * 1: 已处理
   */
  state: number;
}

/**
 * 任务类型定义
 */
export interface Task {
  taskId: string;
  operationsPersonnelId?: string;
  chargingStationId?: string;
  chargingPileId?: string;
  /**
   * 任务类型
   * 0: 维修任务
   * 1: 巡检任务
   * 2: 其他任务
   */
  type: number;
  /**
   * 任务内容
   */
  content: string;
  /**
   * 创建时间
   */
  createTime: string;
  /**
   * 截止时间
   */
  deadline?: string;
  /**
   * 完成时间
   */
  completeTime?: string;
  /**
   * 状态
   * 0: 待分配
   * 1: 进行中
   * 2: 已完成
   * 3: 已取消
   */
  state: number;
}