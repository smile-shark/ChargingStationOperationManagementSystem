interface AlarmMessage {
  id: string;
  pileName: string;
  stationName: string;
  type: string;
  level: 'normal' | 'urgent' | 'critical';
  time: string;
  details: string;
  status: 'unread' | 'read' | 'processed';
}

interface StationStats {
  totalStations: number;
  totalPiles: number;
  chargingPiles: number;
  idlePiles: number;
  offlinePiles: number;
  faultPiles: number;
}

interface TrendDataItem {
  date: string;
  amount: number;
  power: number;
  count: number;
}

interface CoreDataItem {
  title: string;
  value: number;
  growth: number;
}

interface CustomerGrowthItem {
  date: string;
  count: number;
  growth: number;
}

interface HeatMapItem {
  hour: number;
  day: string;
  value: number;
  tags?: string[];
}

interface RegionDataItem {
  region: string;
  count: number;
  lng: number;
  lat: number;
}

interface TagItem {
  name: string;
  value: number;
}

interface RetentionItem {
  step: number;
  label: string;
  value: number;
}

export const mockTrendData: Record<string, TrendDataItem[]> = {
  day: Array.from({ length: 24 }, (_, i) => ({
    date: `${i}:00`,
    amount: Math.floor(Math.random() * 1000) + 500,
    power: Math.floor(Math.random() * 500) + 200,
    count: Math.floor(Math.random() * 50) + 20
  })),
  week: Array.from({ length: 7 }, (_, i) => ({
    date: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'][i],
    amount: Math.floor(Math.random() * 5000) + 2000,
    power: Math.floor(Math.random() * 3000) + 1000,
    count: Math.floor(Math.random() * 200) + 100
  })),
  month: Array.from({ length: 30 }, (_, i) => ({
    date: `${i + 1}日`,
    amount: Math.floor(Math.random() * 10000) + 5000,
    power: Math.floor(Math.random() * 6000) + 3000,
    count: Math.floor(Math.random() * 300) + 150
  })),
  year: Array.from({ length: 12 }, (_, i) => ({
    date: `${i + 1}月`,
    amount: Math.floor(Math.random() * 50000) + 30000,
    power: Math.floor(Math.random() * 30000) + 20000,
    count: Math.floor(Math.random() * 1000) + 500
  }))
};

export const mockCoreData: Record<string, CoreDataItem[]> = {
  day: [
    { title: '充电次数', value: 128, growth: 12.5, icon: 'bolt' },
    { title: '充电电量(kWh)', value: 2560, growth: 8.2, icon: 'battery-full' },
    { title: '充电金额(元)', value: 5120, growth: 15.3, icon: 'money-bill-wave' }
  ],
  week: [
    { title: '充电次数', value: 896, growth: 10.2, icon: 'bolt' },
    { title: '充电电量(kWh)', value: 17920, growth: 7.5, icon: 'battery-full' },
    { title: '充电金额(元)', value: 35840, growth: 12.8, icon: 'money-bill-wave' }
  ],
  month: [
    { title: '充电次数', value: 3840, growth: 8.7, icon: 'bolt' },
    { title: '充电电量(kWh)', value: 76800, growth: 6.3, icon: 'battery-full' },
    { title: '充电金额(元)', value: 153600, growth: 10.5, icon: 'money-bill-wave' }
  ],
  year: [
    { title: '充电次数', value: 46080, growth: 15.2, icon: 'bolt' },
    { title: '充电电量(kWh)', value: 921600, growth: 12.8, icon: 'battery-full' },
    { title: '充电金额(元)', value: 1843200, growth: 18.3, icon: 'money-bill-wave' }
  ]
};

export const mockCustomerGrowth: Record<string, CustomerGrowthItem[]> = {
  day: Array.from({ length: 24 }, (_, i) => ({
    date: `${i}:00`,
    count: Math.floor(Math.random() * 50) + 20,
    growth: Math.floor(Math.random() * 20) - 5
  })),
  week: Array.from({ length: 7 }, (_, i) => ({
    date: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'][i],
    count: Math.floor(Math.random() * 200) + 100,
    growth: Math.floor(Math.random() * 15) - 5
  })),
  month: Array.from({ length: 30 }, (_, i) => ({
    date: `${i + 1}日`,
    count: Math.floor(Math.random() * 300) + 150,
    growth: Math.floor(Math.random() * 10) - 3
  })),
  year: Array.from({ length: 12 }, (_, i) => ({
    date: `${i + 1}月`,
    count: Math.floor(Math.random() * 1000) + 500,
    growth: Math.floor(Math.random() * 30) + 5
  }))
};

export const mockHeatMapData: HeatMapItem[] = Array.from({ length: 24 * 7 }, (_, i) => ({
  hour: i % 24,
  day: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'][Math.floor(i / 24)],
  value: Math.floor(Math.random() * 100),
  tags: ['快充', '慢充', '会员', '新用户'].filter(() => Math.random() > 0.7)
}));

export const mockRegionData: RegionDataItem[] = [
  { region: '朝阳区', count: 1280, lng: 116.404, lat: 39.915 },
  { region: '海淀区', count: 980, lng: 116.3, lat: 39.99 },
  { region: '东城区', count: 750, lng: 116.41, lat: 39.92 },
  { region: '西城区', count: 680, lng: 116.35, lat: 39.91 },
  { region: '丰台区', count: 520, lng: 116.28, lat: 39.85 }
];

export const mockTags: TagItem[] = [
  { name: '快充', value: 1280 },
  { name: '慢充', value: 980 },
  { name: '会员', value: 750 },
  { name: '新用户', value: 680 },
  { name: '企业用户', value: 520 },
  { name: '个人用户', value: 480 },
  { name: '夜间充电', value: 360 },
  { name: '工作日充电', value: 420 }
];

// 充电桩状态数据
export const mockPileStatus = {
  '1': [
    { id: '1', name: 'P001', status: 'charging', power: 7 },
    { id: '2', name: 'P002', status: 'idle', power: 11 },
    { id: '3', name: 'P003', status: 'offline', power: 7 },
    { id: '4', name: 'P004', status: 'fault', power: 22 }
  ],
  '2': [
    { id: '5', name: 'P005', status: 'idle', power: 7 },
    { id: '6', name: 'P006', status: 'charging', power: 11 },
    { id: '7', name: 'P007', status: 'idle', power: 7 }
  ],
  '3': [
    { id: '8', name: 'P008', status: 'offline', power: 22 },
    { id: '9', name: 'P009', status: 'fault', power: 11 }
  ]
};

// 充电站统计数据
export const mockStationStats: StationStats = {
  totalStations: 5,
  totalPiles: 32,
  chargingPiles: 12,
  idlePiles: 15,
  offlinePiles: 3,
  faultPiles: 2
};

// 充电卡mock数据
export interface ChargeCard {
  id: string;
  code: string;
  customer: string;
  phone: string;
  idCard: string;
  level: 'vip1' | 'vip2' | 'vip3' | 'vip4' | 'vip5' | 'vip6';
  createTime: string;
  balance: number;
  status: 'active' | 'inactive';
}

export const mockChargeCards: ChargeCard[] = [
  {
    id: '1',
    code: 'CC001',
    customer: '张三',
    phone: '13800138000',
    idCard: '110101199001011234',
    level: 'vip1',
    createTime: '2025-01-01 10:00:00',
    balance: 500,
    status: 'active'
  },
  {
    id: '2',
    code: 'CC002',
    customer: '李四',
    phone: '13900139000',
    idCard: '110101199102022345',
    level: 'vip3',
    createTime: '2025-02-15 14:30:00',
    balance: 1000,
    status: 'active'
  },
  {
    id: '3',
    code: 'CC003',
    customer: '王五',
    phone: '13700137000',
    idCard: '110101199203033456',
    level: 'vip2',
    createTime: '2025-03-20 09:15:00',
    balance: 200,
    status: 'inactive'
  },
  // 新增21条测试数据
  {
    id: '4',
    code: 'CC004',
    customer: '赵六',
    phone: '13600136000',
    idCard: '110101199304044567',
    level: 'vip4',
    createTime: '2025-04-05 11:20:00',
    balance: 1500,
    status: 'active'
  },
  {
    id: '5',
    code: 'CC005',
    customer: '钱七',
    phone: '13500135000',
    idCard: '110101199405055678',
    level: 'vip5',
    createTime: '2025-05-10 15:45:00',
    balance: 2000,
    status: 'active'
  },
  {
    id: '6',
    code: 'CC006',
    customer: '孙八',
    phone: '13400134000',
    idCard: '110101199506066789',
    level: 'vip6',
    createTime: '2025-06-15 09:30:00',
    balance: 3000,
    status: 'active'
  },
  {
    id: '7',
    code: 'CC007',
    customer: '周九',
    phone: '13300133000',
    idCard: '110101199607077890',
    level: 'vip1',
    createTime: '2025-07-20 14:15:00',
    balance: 100,
    status: 'inactive'
  },
  {
    id: '8',
    code: 'CC008',
    customer: '吴十',
    phone: '13200132000',
    idCard: '110101199708088901',
    level: 'vip2',
    createTime: '2025-08-25 10:00:00',
    balance: 600,
    status: 'active'
  },
  {
    id: '9',
    code: 'CC009',
    customer: '郑十一',
    phone: '13100131000',
    idCard: '110101199809099012',
    level: 'vip3',
    createTime: '2025-09-30 16:30:00',
    balance: 1200,
    status: 'active'
  },
  {
    id: '10',
    code: 'CC010',
    customer: '王十二',
    phone: '13000130000',
    idCard: '110101199910101123',
    level: 'vip4',
    createTime: '2025-10-05 09:45:00',
    balance: 1800,
    status: 'inactive'
  },
  {
    id: '11',
    code: 'CC011',
    customer: '李十三',
    phone: '15900159000',
    idCard: '110101200011112234',
    level: 'vip5',
    createTime: '2025-11-10 13:20:00',
    balance: 2500,
    status: 'active'
  },
  {
    id: '12',
    code: 'CC012',
    customer: '张十四',
    phone: '15800158000',
    idCard: '110101200112122345',
    level: 'vip6',
    createTime: '2025-12-15 17:00:00',
    balance: 3500,
    status: 'active'
  },
  {
    id: '13',
    code: 'CC013',
    customer: '刘十五',
    phone: '15700157000',
    idCard: '110101200213132456',
    level: 'vip1',
    createTime: '2026-01-20 10:30:00',
    balance: 150,
    status: 'inactive'
  },
  {
    id: '14',
    code: 'CC014',
    customer: '陈十六',
    phone: '15600156000',
    idCard: '110101200314142567',
    level: 'vip2',
    createTime: '2026-02-25 14:45:00',
    balance: 700,
    status: 'active'
  },
  {
    id: '15',
    code: 'CC015',
    customer: '杨十七',
    phone: '15500155000',
    idCard: '110101200415152678',
    level: 'vip3',
    createTime: '2026-03-30 08:15:00',
    balance: 1300,
    status: 'active'
  },
  {
    id: '16',
    code: 'CC016',
    customer: '赵十八',
    phone: '15400154000',
    idCard: '110101200516162789',
    level: 'vip4',
    createTime: '2026-04-05 11:40:00',
    balance: 1900,
    status: 'inactive'
  },
  {
    id: '17',
    code: 'CC017',
    customer: '钱十九',
    phone: '15300153000',
    idCard: '110101200617172890',
    level: 'vip5',
    createTime: '2026-05-10 15:05:00',
    balance: 2600,
    status: 'active'
  },
  {
    id: '18',
    code: 'CC018',
    customer: '孙二十',
    phone: '15200152000',
    idCard: '110101200718182901',
    level: 'vip6',
    createTime: '2026-06-15 18:30:00',
    balance: 4000,
    status: 'active'
  },
  {
    id: '19',
    code: 'CC019',
    customer: '周二十一',
    phone: '15100151000',
    idCard: '110101200819193012',
    level: 'vip1',
    createTime: '2026-07-20 09:55:00',
    balance: 300,
    status: 'inactive'
  },
  {
    id: '20',
    code: 'CC020',
    customer: '吴二十二',
    phone: '15000150000',
    idCard: '110101200920203123',
    level: 'vip2',
    createTime: '2026-08-25 13:20:00',
    balance: 800,
    status: 'active'
  },
  {
    id: '21',
    code: 'CC021',
    customer: '郑二十三',
    phone: '14700147000',
    idCard: '110101201021213234',
    level: 'vip3',
    createTime: '2026-09-30 16:45:00',
    balance: 1400,
    status: 'active'
  },
  {
    id: '22',
    code: 'CC022',
    customer: '王二十四',
    phone: '14600146000',
    idCard: '110101201122223345',
    level: 'vip4',
    createTime: '2026-10-05 10:10:00',
    balance: 2200,
    status: 'inactive'
  },
  {
    id: '23',
    code: 'CC023',
    customer: '李二十五',
    phone: '14500145000',
    idCard: '110101201223233456',
    level: 'vip5',
    createTime: '2026-11-10 13:35:00',
    balance: 2800,
    status: 'active'
  },
  {
    id: '24',
    code: 'CC024',
    customer: '张二十六',
    phone: '14400144000',
    idCard: '110101201324243567',
    level: 'vip6',
    createTime: '2026-12-15 17:00:00',
    balance: 4500,
    status: 'active'
  }
];

// 预约mock数据
export interface Reservation {
  id: string;
  pileId: string;
  pileName: string;
  location: string;
  duration: number; // 分钟
  startTime: string;
  customer: string;
  status: 'reserved' | 'canceled';
}

export const mockReservations: Reservation[] = [
  {
    id: '1',
    pileId: 'P001',
    pileName: '直流快充桩1',
    location: '北京朝阳站A区',
    duration: 60,
    startTime: '2025-06-15 14:00:00',
    customer: '张三',
    status: 'reserved'
  },
  {
    id: '2',
    pileId: 'P002',
    pileName: '交流慢充桩1',
    location: '北京朝阳站B区',
    duration: 120,
    startTime: '2025-06-16 10:00:00',
    customer: '李四',
    status: 'reserved'
  },
  {
    id: '3',
    pileId: 'P003',
    pileName: '电瓶车充电桩1',
    location: '上海浦东站C区',
    duration: 180,
    startTime: '2025-06-14 18:00:00',
    customer: '王五',
    status: 'canceled'
  },
  // 新增预约数据
  {
    id: '4',
    pileId: 'P004',
    pileName: '直流快充桩2',
    location: '北京朝阳站A区',
    duration: 45,
    startTime: '2025-06-17 09:00:00',
    customer: '赵六',
    status: 'reserved'
  },
  {
    id: '5',
    pileId: 'P005',
    pileName: '交流慢充桩2',
    location: '北京朝阳站B区',
    duration: 90,
    startTime: '2025-06-17 14:30:00',
    customer: '钱七',
    status: 'reserved'
  },
  {
    id: '6',
    pileId: 'P006',
    pileName: '电瓶车充电桩2',
    location: '上海浦东站C区',
    duration: 120,
    startTime: '2025-06-18 10:00:00',
    customer: '孙八',
    status: 'canceled'
  },
  {
    id: '7',
    pileId: 'P007',
    pileName: '公交车充电桩1',
    location: '广州天河站D区',
    duration: 180,
    startTime: '2025-06-18 08:00:00',
    customer: '周九',
    status: 'reserved'
  },
  {
    id: '8',
    pileId: 'P008',
    pileName: '直流快充桩3',
    location: '深圳南山站A区',
    duration: 60,
    startTime: '2025-06-19 11:00:00',
    customer: '吴十',
    status: 'reserved'
  },
  {
    id: '9',
    pileId: 'P009',
    pileName: '交流慢充桩3',
    location: '成都高新站B区',
    duration: 120,
    startTime: '2025-06-19 15:00:00',
    customer: '郑十一',
    status: 'canceled'
  },
  {
    id: '10',
    pileId: 'P010',
    pileName: '电瓶车充电桩3',
    location: '杭州西湖站C区',
    duration: 90,
    startTime: '2025-06-20 09:30:00',
    customer: '王十二',
    status: 'reserved'
  },
  {
    id: '11',
    pileId: 'P011',
    pileName: '公交车充电桩2',
    location: '南京玄武站D区',
    duration: 150,
    startTime: '2025-06-20 14:00:00',
    customer: '李十三',
    status: 'reserved'
  },
  {
    id: '12',
    pileId: 'P012',
    pileName: '直流快充桩4',
    location: '武汉光谷站A区',
    duration: 45,
    startTime: '2025-06-21 10:00:00',
    customer: '张十四',
    status: 'canceled'
  },
  {
    id: '13',
    pileId: 'P013',
    pileName: '交流慢充桩4',
    location: '西安雁塔站B区',
    duration: 90,
    startTime: '2025-06-21 15:30:00',
    customer: '刘十五',
    status: 'reserved'
  },
  {
    id: '14',
    pileId: 'P014',
    pileName: '电瓶车充电桩4',
    location: '重庆渝中站C区',
    duration: 60,
    startTime: '2025-06-22 08:00:00',
    customer: '陈十六',
    status: 'reserved'
  },
  {
    id: '15',
    pileId: 'P015',
    pileName: '公交车充电桩3',
    location: '天津滨海站D区',
    duration: 180,
    startTime: '2025-06-22 13:00:00',
    customer: '杨十七',
    status: 'canceled'
  },
  {
    id: '16',
    pileId: 'P016',
    pileName: '直流快充桩5',
    location: '苏州园区站A区',
    duration: 60,
    startTime: '2025-06-23 09:00:00',
    customer: '赵十八',
    status: 'reserved'
  },
  {
    id: '17',
    pileId: 'P017',
    pileName: '交流慢充桩5',
    location: '厦门思明站B区',
    duration: 120,
    startTime: '2025-06-23 14:00:00',
    customer: '钱十九',
    status: 'reserved'
  },
  {
    id: '18',
    pileId: 'P018',
    pileName: '电瓶车充电桩5',
    location: '青岛崂山站C区',
    duration: 90,
    startTime: '2025-06-24 10:30:00',
    customer: '孙二十',
    status: 'canceled'
  },
  {
    id: '19',
    pileId: 'P019',
    pileName: '公交车充电桩4',
    location: '长沙岳麓站D区',
    duration: 150,
    startTime: '2025-06-24 15:00:00',
    customer: '周二十一',
    status: 'reserved'
  },
  {
    id: '20',
    pileId: 'P020',
    pileName: '直流快充桩6',
    location: '郑州郑东站A区',
    duration: 45,
    startTime: '2025-06-25 11:00:00',
    customer: '吴二十二',
    status: 'reserved'
  }
];

// 客户mock数据
export interface Customer {
  id: string;
  name: string;
  account: string;
  phone: string;
  type: 'personal' | 'company';
  vehicleCount: number;
  hasCard: boolean;
  accountType: 'prepaid' | 'postpaid' | 'monthly' | 'yearly';
  status: 'active' | 'inactive';
}

export const mockCustomers: Customer[] = [
  {
    id: '1',
    name: '张三',
    account: 'zhangsan',
    phone: '13800138000',
    type: 'personal',
    vehicleCount: 1,
    hasCard: true,
    accountType: 'prepaid',
    status: 'active'
  },
  {
    id: '2',
    name: '李四',
    account: 'lisi',
    phone: '13900139000',
    type: 'personal',
    vehicleCount: 2,
    hasCard: true,
    accountType: 'monthly',
    status: 'active'
  },
  {
    id: '3',
    name: 'ABC公司',
    account: 'abc_company',
    phone: '13700137000',
    type: 'company',
    vehicleCount: 10,
    hasCard: false,
    accountType: 'yearly',
    status: 'inactive'
  },
  // 新增21条测试数据
  {
    id: '4',
    name: '王五',
    account: 'wangwu',
    phone: '13600136000',
    type: 'personal',
    vehicleCount: 1,
    hasCard: true,
    accountType: 'postpaid',
    status: 'active'
  },
  {
    id: '5',
    name: '赵六',
    account: 'zhaoliu',
    phone: '13500135000',
    type: 'personal',
    vehicleCount: 0,
    hasCard: false,
    accountType: 'prepaid',
    status: 'inactive'
  },
  {
    id: '6',
    name: '钱七',
    account: 'qianqi',
    phone: '13400134000',
    type: 'personal',
    vehicleCount: 3,
    hasCard: true,
    accountType: 'monthly',
    status: 'active'
  },
  {
    id: '7',
    name: 'XYZ科技',
    account: 'xyz_tech',
    phone: '13300133000',
    type: 'company',
    vehicleCount: 15,
    hasCard: true,
    accountType: 'yearly',
    status: 'active'
  },
  {
    id: '8',
    name: '孙八',
    account: 'sunba',
    phone: '13200132000',
    type: 'personal',
    vehicleCount: 1,
    hasCard: false,
    accountType: 'prepaid',
    status: 'inactive'
  },
  {
    id: '9',
    name: '周九',
    account: 'zhoujiu',
    phone: '13100131000',
    type: 'personal',
    vehicleCount: 2,
    hasCard: true,
    accountType: 'monthly',
    status: 'active'
  },
  {
    id: '10',
    name: '吴十',
    account: 'wushi',
    phone: '13000130000',
    type: 'personal',
    vehicleCount: 0,
    hasCard: false,
    accountType: 'postpaid',
    status: 'inactive'
  },
  {
    id: '11',
    name: 'EFG物流',
    account: 'efg_logistics',
    phone: '15900159000',
    type: 'company',
    vehicleCount: 20,
    hasCard: true,
    accountType: 'yearly',
    status: 'active'
  },
  {
    id: '12',
    name: '郑十一',
    account: 'zhengshiyi',
    phone: '15800158000',
    type: 'personal',
    vehicleCount: 1,
    hasCard: true,
    accountType: 'prepaid',
    status: 'active'
  },
  {
    id: '13',
    name: '王十二',
    account: 'wangshier',
    phone: '15700157000',
    type: 'personal',
    vehicleCount: 0,
    hasCard: false,
    accountType: 'postpaid',
    status: 'inactive'
  },
  {
    id: '14',
    name: '李十三',
    account: 'lishisan',
    phone: '15600156000',
    type: 'personal',
    vehicleCount: 2,
    hasCard: true,
    accountType: 'monthly',
    status: 'active'
  },
  {
    id: '15',
    name: 'HIJ餐饮',
    account: 'hij_food',
    phone: '15500155000',
    type: 'company',
    vehicleCount: 8,
    hasCard: false,
    accountType: 'yearly',
    status: 'inactive'
  },
  {
    id: '16',
    name: '张十四',
    account: 'zhangshisi',
    phone: '15400154000',
    type: 'personal',
    vehicleCount: 1,
    hasCard: true,
    accountType: 'prepaid',
    status: 'active'
  },
  {
    id: '17',
    name: '刘十五',
    account: 'liushiwu',
    phone: '15300153000',
    type: 'personal',
    vehicleCount: 0,
    hasCard: false,
    accountType: 'postpaid',
    status: 'inactive'
  },
  {
    id: '18',
    name: '陈十六',
    account: 'chenshiliu',
    phone: '15200152000',
    type: 'personal',
    vehicleCount: 3,
    hasCard: true,
    accountType: 'monthly',
    status: 'active'
  },
  {
    id: '19',
    name: 'KLM教育',
    account: 'klm_edu',
    phone: '15100151000',
    type: 'company',
    vehicleCount: 12,
    hasCard: true,
    accountType: 'yearly',
    status: 'active'
  },
  {
    id: '20',
    name: '杨十七',
    account: 'yangshigi',
    phone: '15000150000',
    type: 'personal',
    vehicleCount: 1,
    hasCard: false,
    accountType: 'prepaid',
    status: 'inactive'
  },
  {
    id: '21',
    name: '赵十八',
    account: 'zhaoshiba',
    phone: '14700147000',
    type: 'personal',
    vehicleCount: 2,
    hasCard: true,
    accountType: 'monthly',
    status: 'active'
  },
  {
    id: '22',
    name: '钱十九',
    account: 'qianshijiu',
    phone: '14600146000',
    type: 'personal',
    vehicleCount: 0,
    hasCard: false,
    accountType: 'postpaid',
    status: 'inactive'
  },
  {
    id: '23',
    name: 'OPQ医疗',
    account: 'opq_medical',
    phone: '14500145000',
    type: 'company',
    vehicleCount: 18,
    hasCard: true,
    accountType: 'yearly',
    status: 'active'
  },
  {
    id: '24',
    name: '孙二十',
    account: 'sunershi',
    phone: '14400144000',
    type: 'personal',
    vehicleCount: 1,
    hasCard: true,
    accountType: 'prepaid',
    status: 'active'
  }
];

// 车辆mock数据
export interface Vehicle {
  id: string;
  plateNumber: string;
  brandModel: string;
  type: 'pure' | 'hybrid';
  color: string;
  batteryCapacity: number;
  range: number;
  customerId: string;
  customerName: string;
  status: 'active' | 'inactive';
}

export interface VehicleFault {
  id: string;
  vehicleId: string;
  faultTime: string;
  description: string;
  status: 'pending' | 'processing' | 'resolved';
}

export const mockVehicles: Vehicle[] = [
  {
    id: '1',
    plateNumber: '京A12345',
    brandModel: '特斯拉 Model 3',
    type: 'pure',
    color: '红色',
    batteryCapacity: 75,
    range: 500,
    customerId: '1',
    customerName: '张三',
    status: 'active'
  },
  {
    id: '2',
    plateNumber: '沪B67890',
    brandModel: '比亚迪 汉',
    type: 'hybrid',
    color: '蓝色',
    batteryCapacity: 60,
    range: 400,
    customerId: '2',
    customerName: '李四',
    status: 'active'
  },
  {
    id: '3',
    plateNumber: '粤C45678',
    brandModel: '蔚来 ES6',
    type: 'pure',
    color: '白色',
    batteryCapacity: 70,
    range: 450,
    customerId: '3',
    customerName: '王五',
    status: 'inactive'
  },
  {
    id: '4',
    plateNumber: '京D78901',
    brandModel: '小鹏 P7',
    type: 'pure',
    color: '灰色',
    batteryCapacity: 80,
    range: 600,
    customerId: '1',
    customerName: '张三',
    status: 'active'
  },
  {
    id: '5',
    plateNumber: '沪E23456',
    brandModel: '理想 ONE',
    type: 'hybrid',
    color: '黑色',
    batteryCapacity: 40,
    range: 800,
    customerId: '2',
    customerName: '李四',
    status: 'active'
  },
  {
    id: '6',
    plateNumber: '粤F56789',
    brandModel: '极氪 001',
    type: 'pure',
    color: '蓝色',
    batteryCapacity: 100,
    range: 700,
    customerId: '3',
    customerName: '王五',
    status: 'inactive'
  },
  {
    id: '7',
    plateNumber: '京G01234',
    brandModel: '问界 M5',
    type: 'hybrid',
    color: '银色',
    batteryCapacity: 40,
    range: 1000,
    customerId: '1',
    customerName: '张三',
    status: 'active'
  },
  {
    id: '8',
    plateNumber: '沪H34567',
    brandModel: '阿维塔 11',
    type: 'pure',
    color: '绿色',
    batteryCapacity: 90,
    range: 550,
    customerId: '2',
    customerName: '李四',
    status: 'active'
  },
  {
    id: '9',
    plateNumber: '粤I67890',
    brandModel: '智己 L7',
    type: 'pure',
    color: '金色',
    batteryCapacity: 90,
    range: 615,
    customerId: '3',
    customerName: '王五',
    status: 'inactive'
  },
  {
    id: '10',
    plateNumber: '京J12345',
    brandModel: '飞凡 R7',
    type: 'pure',
    color: '紫色',
    batteryCapacity: 77,
    range: 642,
    customerId: '1',
    customerName: '张三',
    status: 'active'
  }
];

export const mockVehicleFaults: VehicleFault[] = [
  {
    id: '1',
    vehicleId: '1',
    faultTime: '2025-06-10 14:30:00',
    description: '电池充电异常，充电速度明显下降',
    status: 'resolved'
  },
  {
    id: '2',
    vehicleId: '2',
    faultTime: '2025-06-12 09:15:00',
    description: '电机异响，需要检查',
    status: 'processing'
  },
  {
    id: '3',
    vehicleId: '1',
    faultTime: '2025-06-14 16:45:00',
    description: '仪表盘显示异常',
    status: 'pending'
  }
];


// 计费规则mock数据
export interface FeeRule {
  id: string;
  name: string;
  periods: {
    type: 'all' | 'peak' | 'offpeak' | 'normal' | 'valley';
    timeRange: string;
    price: number;
    nightPrice?: number;
  }[];
  status: 'active' | 'inactive';
}

export const mockFeeRules: FeeRule[] = [
  {
    id: '1',
    name: '标准计费规则',
    status: 'active',
    periods: [
      { type: 'all', timeRange: '全天', price: 1.0, nightPrice: 0.6 },
      { type: 'peak', timeRange: '7:00-9:00,16:00-20:00', price: 1.5, nightPrice: 0.8 },
      { type: 'offpeak', timeRange: '9:00-12:00', price: 1.1, nightPrice: 0.7 },
      { type: 'normal', timeRange: '12:00-16:00,20:00-23:00', price: 0.7, nightPrice: 0.5 },
      { type: 'valley', timeRange: '0:00-7:00,23:00-24:00', price: 0.3, nightPrice: 0.5 }
    ]
  }
];

export const mockAlarmMessages: AlarmMessage[] = Array.from({ length: 25 }, (_, i) => ({
  id: (i + 4).toString(),
  pileName: ['直流快充桩', '交流慢充桩', '电瓶车充电桩'][i % 3] + (i % 5 + 1),
  stationName: ['朝阳站', '浦东站', '天河站', '南山站', '高新站'][i % 5],
  type: ['温度过高', '电压异常', '绝缘故障', '漏电流', '通信中断'][i % 5],
  level: ['normal', 'urgent', 'critical'][i % 3],
  time: `2025-06-${Math.floor(i / 10) + 1} ${i % 24}:${i % 60}:${i % 60}`,
  details: ['充电枪温度超过80°C', 'A相电压超过250V', '绝缘电阻低于0.5MΩ', '漏电流超过30mA', '通信中断超过5分钟'][i % 5],
  status: ['unread', 'read', 'processed'][i % 3]
}));

export const mockRetentionData: RetentionItem[] = [

  { step: 1, label: '首次充电', value: 100 },
  { step: 2, label: '7日内', value: 65 },
  { step: 3, label: '14日内', value: 42 },
  { step: 4, label: '30日内', value: 28 },
  { step: 5, label: '60日内', value: 15 }
];

// 充电记录mock数据
export interface ChargeRecord {
  id: string;
  power: number; // 充电电量(kWh)
  paymentMethod: 'alipay' | 'wechat' | 'card' | 'cash';
  gunNo: string; // 充电枪号
  status: 'charging' | 'finished';
  customer: string;
  orderNo: string;
  phone: string;
  duration: number; // 充电时长(分钟)
  amount: number; // 金额
  category: 'car' | 'bike' | 'bus';
  station: string;
  pileNo: string;
  startTime: string;
  endTime: string;
}

export const mockChargeRecords: ChargeRecord[] = [
  {
    id: '1',
    power: 30.5,
    paymentMethod: 'alipay',
    gunNo: 'G001',
    status: 'finished',
    customer: '张三',
    orderNo: 'CR20230614001',
    phone: '13800138000',
    duration: 120,
    amount: 61.0,
    category: 'car',
    station: '北京朝阳充电站',
    pileNo: 'P001',
    startTime: '2025-06-14 10:00:00',
    endTime: '2025-06-14 12:00:00'
  },
  {
    id: '2',
    power: 15.2,
    paymentMethod: 'wechat',
    gunNo: 'G002',
    status: 'charging',
    customer: '李四',
    orderNo: 'CR20230614002',
    phone: '13900139000',
    duration: 60,
    amount: 30.4,
    category: 'bike',
    station: '上海浦东充电站',
    pileNo: 'P003',
    startTime: '2025-06-14 14:00:00',
    endTime: ''
  },
  // 新增21条测试数据
  {
    id: '3',
    power: 45.8,
    paymentMethod: 'card',
    gunNo: 'G003',
    status: 'finished',
    customer: '王五',
    orderNo: 'CR20230614003',
    phone: '13700137000',
    duration: 180,
    amount: 91.6,
    category: 'car',
    station: '广州天河充电站',
    pileNo: 'P005',
    startTime: '2025-06-14 09:00:00',
    endTime: '2025-06-14 12:00:00'
  },
  {
    id: '4',
    power: 22.1,
    paymentMethod: 'alipay',
    gunNo: 'G004',
    status: 'finished',
    customer: '赵六',
    orderNo: 'CR20230614004',
    phone: '13600136000',
    duration: 90,
    amount: 44.2,
    category: 'bus',
    station: '深圳南山充电站',
    pileNo: 'P007',
    startTime: '2025-06-15 10:30:00',
    endTime: '2025-06-15 12:00:00'
  },
  {
    id: '5',
    power: 18.7,
    paymentMethod: 'wechat',
    gunNo: 'G005',
    status: 'charging',
    customer: '钱七',
    orderNo: 'CR20230614005',
    phone: '13500135000',
    duration: 45,
    amount: 37.4,
    category: 'car',
    station: '成都高新充电站',
    pileNo: 'P009',
    startTime: '2025-06-15 14:00:00',
    endTime: ''
  },
  {
    id: '6',
    power: 33.4,
    paymentMethod: 'card',
    gunNo: 'G006',
    status: 'finished',
    customer: '孙八',
    orderNo: 'CR20230614006',
    phone: '13400134000',
    duration: 120,
    amount: 66.8,
    category: 'car',
    station: '杭州西湖充电站',
    pileNo: 'P011',
    startTime: '2025-06-16 08:00:00',
    endTime: '2025-06-16 10:00:00'
  },
  {
    id: '7',
    power: 12.5,
    paymentMethod: 'cash',
    gunNo: 'G007',
    status: 'finished',
    customer: '周九',
    orderNo: 'CR20230614007',
    phone: '13300133000',
    duration: 60,
    amount: 25.0,
    category: 'bike',
    station: '南京玄武充电站',
    pileNo: 'P013',
    startTime: '2025-06-16 11:00:00',
    endTime: '2025-06-16 12:00:00'
  },
  {
    id: '8',
    power: 28.9,
    paymentMethod: 'alipay',
    gunNo: 'G008',
    status: 'finished',
    customer: '吴十',
    orderNo: 'CR20230614008',
    phone: '13200132000',
    duration: 150,
    amount: 57.8,
    category: 'car',
    station: '武汉光谷充电站',
    pileNo: 'P015',
    startTime: '2025-06-17 09:30:00',
    endTime: '2025-06-17 12:00:00'
  },
  {
    id: '9',
    power: 19.3,
    paymentMethod: 'wechat',
    gunNo: 'G009',
    status: 'charging',
    customer: '郑十一',
    orderNo: 'CR20230614009',
    phone: '13100131000',
    duration: 90,
    amount: 38.6,
    category: 'bus',
    station: '西安雁塔充电站',
    pileNo: 'P017',
    startTime: '2025-06-17 14:00:00',
    endTime: ''
  },
  {
    id: '10',
    power: 25.6,
    paymentMethod: 'card',
    gunNo: 'G010',
    status: 'finished',
    customer: '王十二',
    orderNo: 'CR20230614010',
    phone: '13000130000',
    duration: 120,
    amount: 51.2,
    category: 'car',
    station: '重庆渝中充电站',
    pileNo: 'P019',
    startTime: '2025-06-18 10:00:00',
    endTime: '2025-06-18 12:00:00'
  },
  {
    id: '11',
    power: 14.2,
    paymentMethod: 'cash',
    gunNo: 'G011',
    status: 'finished',
    customer: '李十三',
    orderNo: 'CR20230614011',
    phone: '15900159000',
    duration: 45,
    amount: 28.4,
    category: 'bike',
    station: '天津滨海充电站',
    pileNo: 'P021',
    startTime: '2025-06-18 13:00:00',
    endTime: '2025-06-18 13:45:00'
  },
  {
    id: '12',
    power: 32.7,
    paymentMethod: 'alipay',
    gunNo: 'G012',
    status: 'finished',
    customer: '张十四',
    orderNo: 'CR20230614012',
    phone: '15800158000',
    duration: 180,
    amount: 65.4,
    category: 'car',
    station: '苏州园区充电站',
    pileNo: 'P023',
    startTime: '2025-06-19 08:00:00',
    endTime: '2025-06-19 11:00:00'
  },
  {
    id: '13',
    power: 21.5,
    paymentMethod: 'wechat',
    gunNo: 'G013',
    status: 'charging',
    customer: '刘十五',
    orderNo: 'CR20230614013',
    phone: '15700157000',
    duration: 60,
    amount: 43.0,
    category: 'car',
    station: '厦门思明充电站',
    pileNo: 'P025',
    startTime: '2025-06-19 14:00:00',
    endTime: ''
  },
  {
    id: '14',
    power: 17.8,
    paymentMethod: 'card',
    gunNo: 'G014',
    status: 'finished',
    customer: '陈十六',
    orderNo: 'CR20230614014',
    phone: '15600156000',
    duration: 90,
    amount: 35.6,
    category: 'bus',
    station: '青岛崂山充电站',
    pileNo: 'P027',
    startTime: '2025-06-20 09:30:00',
    endTime: '2025-06-20 11:00:00'
  },
  {
    id: '15',
    power: 29.3,
    paymentMethod: 'cash',
    gunNo: 'G015',
    status: 'finished',
    customer: '杨十七',
    orderNo: 'CR20230614015',
    phone: '15500155000',
    duration: 120,
    amount: 58.6,
    category: 'car',
    station: '长沙岳麓充电站',
    pileNo: 'P029',
    startTime: '2025-06-20 10:00:00',
    endTime: '2025-06-20 12:00:00'
  },
  {
    id: '16',
    power: 16.4,
    paymentMethod: 'alipay',
    gunNo: 'G016',
    status: 'charging',
    customer: '赵十八',
    orderNo: 'CR20230614016',
    phone: '15400154000',
    duration: 45,
    amount: 32.8,
    category: 'bike',
    station: '郑州郑东充电站',
    pileNo: 'P031',
    startTime: '2025-06-21 11:00:00',
    endTime: ''
  },
  {
    id: '17',
    power: 24.7,
    paymentMethod: 'wechat',
    gunNo: 'G017',
    status: 'finished',
    customer: '钱十九',
    orderNo: 'CR20230614017',
    phone: '15300153000',
    duration: 90,
    amount: 49.4,
    category: 'car',
    station: '东莞松山湖充电站',
    pileNo: 'P033',
    startTime: '2025-06-21 09:00:00',
    endTime: '2025-06-21 10:30:00'
  },
  {
    id: '18',
    power: 20.1,
    paymentMethod: 'card',
    gunNo: 'G018',
    status: 'finished',
    customer: '孙二十',
    orderNo: 'CR20230614018',
    phone: '15200152000',
    duration: 60,
    amount: 40.2,
    category: 'bus',
    station: '佛山南海充电站',
    pileNo: 'P035',
    startTime: '2025-06-22 10:00:00',
    endTime: '2025-06-22 11:00:00'
  },
  {
    id: '19',
    power: 35.6,
    paymentMethod: 'cash',
    gunNo: 'G019',
    status: 'finished',
    customer: '周二十一',
    orderNo: 'CR20230614019',
    phone: '15100151000',
    duration: 180,
    amount: 71.2,
    category: 'car',
    station: '宁波鄞州充电站',
    pileNo: 'P037',
    startTime: '2025-06-22 08:00:00',
    endTime: '2025-06-22 11:00:00'
  },
  {
    id: '20',
    power: 18.9,
    paymentMethod: 'alipay',
    gunNo: 'G020',
    status: 'charging',
    customer: '吴二十二',
    orderNo: 'CR20230614020',
    phone: '15000150000',
    duration: 90,
    amount: 37.8,
    category: 'car',
    station: '无锡滨湖充电站',
    pileNo: 'P039',
    startTime: '2025-06-23 14:00:00',
    endTime: ''
  },
  {
    id: '21',
    power: 27.3,
    paymentMethod: 'wechat',
    gunNo: 'G021',
    status: 'finished',
    customer: '郑二十三',
    orderNo: 'CR20230614021',
    phone: '14900149000',
    duration: 120,
    amount: 54.6,
    category: 'car',
    station: '合肥蜀山充电站',
    pileNo: 'P041',
    startTime: '2025-06-23 09:00:00',
    endTime: '2025-06-23 11:00:00'
  },
  {
    id: '22',
    power: 15.7,
    paymentMethod: 'card',
    gunNo: 'G022',
    status: 'finished',
    customer: '王二十四',
    orderNo: 'CR20230614022',
    phone: '14800148000',
    duration: 45,
    amount: 31.4,
    category: 'bike',
    station: '福州鼓楼充电站',
    pileNo: 'P043',
    startTime: '2025-06-24 10:30:00',
    endTime: '2025-06-24 11:15:00'
  },
  {
    id: '23',
    power: 31.8,
    paymentMethod: 'cash',
    gunNo: 'G023',
    status: 'charging',
    customer: '李二十五',
    orderNo: 'CR20230614023',
    phone: '14700147000',
    duration: 60,
    amount: 63.6,
    category: 'car',
    station: '南昌红谷滩充电站',
    pileNo: 'P045',
    startTime: '2025-06-24 14:00:00',
    endTime: ''
  }
];

// 交易流水mock数据
export interface Transaction {
  id: string;
  customer: string;
  phone: string;
  type: 'charge' | 'recharge' | 'refund';
  paymentMethod: 'alipay' | 'wechat' | 'card' | 'cash';
  station: string;
  status: 'completed' | 'pending';
  time: string;
  orderNo: string;
  amount: number;
  pileNo: string;
}

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    customer: '张三',
    phone: '13800138000',
    type: 'charge',
    paymentMethod: 'alipay',
    station: '北京朝阳充电站',
    status: 'completed',
    time: '2025-06-14 12:05:00',
    orderNo: 'CR20230614001',
    amount: 61.0,
    pileNo: 'P001'
  },
  {
    id: '2',
    customer: '李四',
    phone: '13900139000',
    type: 'recharge',
    paymentMethod: 'wechat',
    station: '',
    status: 'pending',
    time: '2025-06-14 13:30:00',
    orderNo: 'RC20230614001',
    amount: 100.0,
    pileNo: ''
  },
  // 新增21条测试数据
  {
    id: '3',
    customer: '王五',
    phone: '13700137000',
    type: 'charge',
    paymentMethod: 'card',
    station: '上海浦东充电站',
    status: 'completed',
    time: '2025-06-14 14:15:00',
    orderNo: 'CR20230614002',
    amount: 45.5,
    pileNo: 'P003'
  },
  {
    id: '4',
    customer: '赵六',
    phone: '13600136000',
    type: 'refund',
    paymentMethod: 'alipay',
    station: '广州天河充电站',
    status: 'completed',
    time: '2025-06-15 09:30:00',
    orderNo: 'RF20230615001',
    amount: -30.0,
    pileNo: 'P005'
  },
  {
    id: '5',
    customer: '钱七',
    phone: '13500135000',
    type: 'charge',
    paymentMethod: 'wechat',
    station: '深圳南山充电站',
    status: 'pending',
    time: '2025-06-15 10:45:00',
    orderNo: 'CR20230615003',
    amount: 75.0,
    pileNo: 'P007'
  },
  {
    id: '6',
    customer: '孙八',
    phone: '13400134000',
    type: 'recharge',
    paymentMethod: 'card',
    station: '',
    status: 'completed',
    time: '2025-06-15 11:20:00',
    orderNo: 'RC20230615002',
    amount: 200.0,
    pileNo: ''
  },
  {
    id: '7',
    customer: '周九',
    phone: '13300133000',
    type: 'charge',
    paymentMethod: 'cash',
    station: '成都高新充电站',
    status: 'completed',
    time: '2025-06-16 08:15:00',
    orderNo: 'CR20230616001',
    amount: 50.0,
    pileNo: 'P009'
  },
  {
    id: '8',
    customer: '吴十',
    phone: '13200132000',
    type: 'refund',
    paymentMethod: 'wechat',
    station: '杭州西湖充电站',
    status: 'completed',
    time: '2025-06-16 14:30:00',
    orderNo: 'RF20230616001',
    amount: -20.0,
    pileNo: 'P011'
  },
  {
    id: '9',
    customer: '郑十一',
    phone: '13100131000',
    type: 'charge',
    paymentMethod: 'alipay',
    station: '南京玄武充电站',
    status: 'pending',
    time: '2025-06-17 09:45:00',
    orderNo: 'CR20230617001',
    amount: 65.0,
    pileNo: 'P013'
  },
  {
    id: '10',
    customer: '王十二',
    phone: '13000130000',
    type: 'recharge',
    paymentMethod: 'card',
    station: '',
    status: 'completed',
    time: '2025-06-17 11:10:00',
    orderNo: 'RC20230617001',
    amount: 150.0,
    pileNo: ''
  },
  {
    id: '11',
    customer: '李十三',
    phone: '15900159000',
    type: 'charge',
    paymentMethod: 'wechat',
    station: '武汉光谷充电站',
    status: 'completed',
    time: '2025-06-18 10:25:00',
    orderNo: 'CR20230618001',
    amount: 55.0,
    pileNo: 'P015'
  },
  {
    id: '12',
    customer: '张十四',
    phone: '15800158000',
    type: 'refund',
    paymentMethod: 'alipay',
    station: '西安雁塔充电站',
    status: 'completed',
    time: '2025-06-18 15:40:00',
    orderNo: 'RF20230618001',
    amount: -25.0,
    pileNo: 'P017'
  },
  {
    id: '13',
    customer: '刘十五',
    phone: '15700157000',
    type: 'charge',
    paymentMethod: 'cash',
    station: '重庆渝中充电站',
    status: 'pending',
    time: '2025-06-19 08:55:00',
    orderNo: 'CR20230619001',
    amount: 70.0,
    pileNo: 'P019'
  },
  {
    id: '14',
    customer: '陈十六',
    phone: '15600156000',
    type: 'recharge',
    paymentMethod: 'card',
    station: '',
    status: 'completed',
    time: '2025-06-19 12:20:00',
    orderNo: 'RC20230619001',
    amount: 180.0,
    pileNo: ''
  },
  {
    id: '15',
    customer: '杨十七',
    phone: '15500155000',
    type: 'charge',
    paymentMethod: 'wechat',
    station: '天津滨海充电站',
    status: 'completed',
    time: '2025-06-20 09:35:00',
    orderNo: 'CR20230620001',
    amount: 60.0,
    pileNo: 'P021'
  },
  {
    id: '16',
    customer: '赵十八',
    phone: '15400154000',
    type: 'refund',
    paymentMethod: 'alipay',
    station: '苏州园区充电站',
    status: 'completed',
    time: '2025-06-20 14:50:00',
    orderNo: 'RF20230620001',
    amount: -35.0,
    pileNo: 'P023'
  },
  {
    id: '17',
    customer: '钱十九',
    phone: '15300153000',
    type: 'charge',
    paymentMethod: 'cash',
    station: '厦门思明充电站',
    status: 'pending',
    time: '2025-06-21 10:05:00',
    orderNo: 'CR20230621001',
    amount: 80.0,
    pileNo: 'P025'
  },
  {
    id: '18',
    customer: '孙二十',
    phone: '15200152000',
    type: 'recharge',
    paymentMethod: 'card',
    station: '',
    status: 'completed',
    time: '2025-06-21 13:30:00',
    orderNo: 'RC20230621001',
    amount: 220.0,
    pileNo: ''
  },
  {
    id: '19',
    customer: '周二十一',
    phone: '15100151000',
    type: 'charge',
    paymentMethod: 'wechat',
    station: '青岛崂山充电站',
    status: 'completed',
    time: '2025-06-22 08:45:00',
    orderNo: 'CR20230622001',
    amount: 65.0,
    pileNo: 'P027'
  },
  {
    id: '20',
    customer: '吴二十二',
    phone: '15000150000',
    type: 'refund',
    paymentMethod: 'alipay',
    station: '长沙岳麓充电站',
    status: 'completed',
    time: '2025-06-22 16:00:00',
    orderNo: 'RF20230622001',
    amount: -40.0,
    pileNo: 'P029'
  },
  {
    id: '21',
    customer: '郑二十三',
    phone: '14900149000',
    type: 'charge',
    paymentMethod: 'cash',
    station: '郑州郑东充电站',
    status: 'pending',
    time: '2025-06-23 09:15:00',
    orderNo: 'CR20230623001',
    amount: 90.0,
    pileNo: 'P031'
  },
  {
    id: '22',
    customer: '王二十四',
    phone: '14800148000',
    type: 'recharge',
    paymentMethod: 'card',
    station: '',
    status: 'completed',
    time: '2025-06-23 14:40:00',
    orderNo: 'RC20230623001',
    amount: 250.0,
    pileNo: ''
  },
  {
    id: '23',
    customer: '李二十五',
    phone: '14700147000',
    type: 'charge',
    paymentMethod: 'wechat',
    station: '东莞松山湖充电站',
    status: 'completed',
    time: '2025-06-24 10:55:00',
    orderNo: 'CR20230624001',
    amount: 55.0,
    pileNo: 'P033'
  }
];

// 充值记录mock数据
export interface RechargeRecord {
  id: string;
  orderNo: string;
  time: string;
  customer: string;
  phone: string;
  type: 'card' | 'account';
  paymentMethod: 'alipay' | 'wechat' | 'card' | 'cash';
  amount: number;
  cardNo?: string;
  account?: string;
  balance: number;
  status: 'completed' | 'failed';
}

export const mockRechargeRecords: RechargeRecord[] = [
  {
    id: '1',
    orderNo: 'RC20230614001',
    time: '2025-06-14 13:30:00',
    customer: '李四',
    phone: '13900139000',
    type: 'card',
    paymentMethod: 'wechat',
    amount: 100.0,
    cardNo: 'CC002',
    balance: 200.0,
    status: 'completed'
  },
  {
    id: '2',
    orderNo: 'RC20230614002',
    time: '2025-06-14 15:00:00',
    customer: '王五',
    phone: '13700137000',
    type: 'account',
    paymentMethod: 'alipay',
    amount: 50.0,
    account: 'zhangsan',
    balance: 150.0,
    status: 'failed'
  },
  // 新增21条测试数据
  {
    id: '3',
    orderNo: 'RC20230614003',
    time: '2025-06-15 10:15:00',
    customer: '张三',
    phone: '13800138000',
    type: 'card',
    paymentMethod: 'alipay',
    amount: 200.0,
    cardNo: 'CC001',
    balance: 500.0,
    status: 'completed'
  },
  {
    id: '4',
    orderNo: 'RC20230614004',
    time: '2025-06-15 11:30:00',
    customer: '赵六',
    phone: '13600136000',
    type: 'account',
    paymentMethod: 'wechat',
    amount: 150.0,
    account: 'zhaoliu',
    balance: 300.0,
    status: 'completed'
  },
  {
    id: '5',
    orderNo: 'RC20230614005',
    time: '2025-06-15 14:45:00',
    customer: '钱七',
    phone: '13500135000',
    type: 'card',
    paymentMethod: 'card',
    amount: 300.0,
    cardNo: 'CC005',
    balance: 600.0,
    status: 'completed'
  },
  {
    id: '6',
    orderNo: 'RC20230614006',
    time: '2025-06-16 09:20:00',
    customer: '孙八',
    phone: '13400134000',
    type: 'account',
    paymentMethod: 'cash',
    amount: 80.0,
    account: 'sunba',
    balance: 180.0,
    status: 'failed'
  },
  {
    id: '7',
    orderNo: 'RC20230614007',
    time: '2025-06-16 10:30:00',
    customer: '周九',
    phone: '13300133000',
    type: 'card',
    paymentMethod: 'wechat',
    amount: 250.0,
    cardNo: 'CC007',
    balance: 500.0,
    status: 'completed'
  },
  {
    id: '8',
    orderNo: 'RC20230614008',
    time: '2025-06-16 15:00:00',
    customer: '吴十',
    phone: '13200132000',
    type: 'account',
    paymentMethod: 'alipay',
    amount: 120.0,
    account: 'wushi',
    balance: 250.0,
    status: 'completed'
  },
  {
    id: '9',
    orderNo: 'RC20230614009',
    time: '2025-06-17 11:15:00',
    customer: '郑十一',
    phone: '13100131000',
    type: 'card',
    paymentMethod: 'wechat',
    amount: 180.0,
    cardNo: 'CC009',
    balance: 380.0,
    status: 'completed'
  },
  {
    id: '10',
    orderNo: 'RC20230614010',
    time: '2025-06-17 14:30:00',
    customer: '王十二',
    phone: '13000130000',
    type: 'account',
    paymentMethod: 'alipay',
    amount: 90.0,
    account: 'wangshier',
    balance: 190.0,
    status: 'failed'
  },
  {
    id: '11',
    orderNo: 'RC20230614011',
    time: '2025-06-18 10:00:00',
    customer: '李十三',
    phone: '15900159000',
    type: 'card',
    paymentMethod: 'card',
    amount: 220.0,
    cardNo: 'CC011',
    balance: 450.0,
    status: 'completed'
  },
  {
    id: '12',
    orderNo: 'RC20230614012',
    time: '2025-06-18 13:45:00',
    customer: '张十四',
    phone: '15800158000',
    type: 'account',
    paymentMethod: 'cash',
    amount: 70.0,
    account: 'zhangshisi',
    balance: 150.0,
    status: 'completed'
  },
  {
    id: '13',
    orderNo: 'RC20230614013',
    time: '2025-06-19 09:30:00',
    customer: '刘十五',
    phone: '15700157000',
    type: 'card',
    paymentMethod: 'wechat',
    amount: 300.0,
    cardNo: 'CC013',
    balance: 600.0,
    status: 'completed'
  },
  {
    id: '14',
    orderNo: 'RC20230614014',
    time: '2025-06-19 11:20:00',
    customer: '陈十六',
    phone: '15600156000',
    type: 'account',
    paymentMethod: 'alipay',
    amount: 150.0,
    account: 'chenshiliu',
    balance: 300.0,
    status: 'completed'
  },
  {
    id: '15',
    orderNo: 'RC20230614015',
    time: '2025-06-20 10:15:00',
    customer: '杨十七',
    phone: '15500155000',
    type: 'card',
    paymentMethod: 'card',
    amount: 180.0,
    cardNo: 'CC015',
    balance: 380.0,
    status: 'failed'
  },
  {
    id: '16',
    orderNo: 'RC20230614016',
    time: '2025-06-20 14:00:00',
    customer: '赵十八',
    phone: '15400154000',
    type: 'account',
    paymentMethod: 'wechat',
    amount: 200.0,
    account: 'zhaoshiba',
    balance: 400.0,
    status: 'completed'
  },
  {
    id: '17',
    orderNo: 'RC20230614017',
    time: '2025-06-21 09:45:00',
    customer: '钱十九',
    phone: '15300153000',
    type: 'card',
    paymentMethod: 'alipay',
    amount: 250.0,
    cardNo: 'CC017',
    balance: 500.0,
    status: 'completed'
  },
  {
    id: '18',
    orderNo: 'RC20230614018',
    time: '2025-06-21 11:30:00',
    customer: '孙二十',
    phone: '15200152000',
    type: 'account',
    paymentMethod: 'cash',
    amount: 120.0,
    account: 'sunershi',
    balance: 250.0,
    status: 'completed'
  },
  {
    id: '19',
    orderNo: 'RC20230614019',
    time: '2025-06-22 10:00:00',
    customer: '周二十一',
    phone: '15100151000',
    type: 'card',
    paymentMethod: 'wechat',
    amount: 180.0,
    cardNo: 'CC019',
    balance: 380.0,
    status: 'completed'
  },
  {
    id: '20',
    orderNo: 'RC20230614020',
    time: '2025-06-22 14:30:00',
    customer: '吴二十二',
    phone: '15000150000',
    type: 'account',
    paymentMethod: 'alipay',
    amount: 90.0,
    account: 'wuershi',
    balance: 190.0,
    status: 'failed'
  },
  {
    id: '21',
    orderNo: 'RC20230614021',
    time: '2025-06-23 09:15:00',
    customer: '郑二十三',
    phone: '14900149000',
    type: 'card',
    paymentMethod: 'card',
    amount: 220.0,
    cardNo: 'CC021',
    balance: 450.0,
    status: 'completed'
  },
  {
    id: '22',
    orderNo: 'RC20230614022',
    time: '2025-06-23 13:00:00',
    customer: '王二十四',
    phone: '14800148000',
    type: 'account',
    paymentMethod: 'cash',
    amount: 70.0,
    account: 'wangshisi',
    balance: 150.0,
    status: 'completed'
  },
  {
    id: '23',
    orderNo: 'RC20230614023',
    time: '2025-06-24 10:30:00',
    customer: '李二十五',
    phone: '14700147000',
    type: 'card',
    paymentMethod: 'wechat',
    amount: 300.0,
    cardNo: 'CC023',
    balance: 600.0,
    status: 'completed'
  }
];