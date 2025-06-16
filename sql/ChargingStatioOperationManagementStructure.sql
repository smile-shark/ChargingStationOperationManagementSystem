/*==============================================================*/
/* DBMS name:      MySQL 5.0                                    */
/* Created on:     2025/6/16 14:15:00                           */
/*==============================================================*/


drop table if exists alarm_msg;

drop table if exists alarm_set;

drop table if exists billing_rules;

drop table if exists billing_rules_detail;

drop table if exists car;

drop table if exists car_m;

drop table if exists charging_card;

drop table if exists charging_pile;

drop table if exists charging_record;

drop table if exists charging_station;

drop table if exists operations_personnel;

drop table if exists recharge_record;

drop table if exists reservation;

drop table if exists task;

drop table if exists transaction_flow;

drop table if exists user;

/*==============================================================*/
/* Table: alarm_msg                                             */
/*==============================================================*/
create table alarm_msg
(
   alarm_msg_id         char(32) not null,
   charging_pile_id     char(32),
   type                 int comment '0电压异常
            1电流异常
            2温度过高
            3绝缘故障
            4漏电流
            5通信中断',
   level                int comment '0：一般；1：紧急；2：严重',
   alarm_time           datetime,
   deatil               text,
   state                int comment '0：未读；1：已读；2：已处理',
   primary key (alarm_msg_id)
);

/*==============================================================*/
/* Table: alarm_set                                             */
/*==============================================================*/
create table alarm_set
(
   charging_pile_id     char(32),
   type                 int comment 'A相电压
            B相电压
            C相电压
            A相电流
            B相电流
            C相电流
            环境温度
            充电枪温度
            充电模块温度
            绝缘电阻
            漏电流',
   warning              double comment '警告阈值',
   serious              double comment '严重阈值',
   alarm_delay          double comment '报警延迟'
);

/*==============================================================*/
/* Table: billing_rules                                         */
/*==============================================================*/
create table billing_rules
(
   billing_rules_id     char(32) not null,
   name                 varbinary(20),
   time_range           int comment '0：工作日；1：星期一...7：星期日；8：周某；9：节假日',
   start_date           date,
   end_date             date,
   `order`              int,
   primary key (billing_rules_id)
);

/*==============================================================*/
/* Table: billing_rules_detail                                  */
/*==============================================================*/
create table billing_rules_detail
(
   billing_rules_id     char(32),
   start_time           time,
   end_time             time,
   price                double(10,2)
);

/*==============================================================*/
/* Table: car                                                   */
/*==============================================================*/
create table car
(
   car_id               char(32) not null,
   car_plate            varchar(20),
   model                varchar(20),
   color                text,
   battery_capacity     int,
  `range`               int,
   state                int comment '0：停用；1：启用',
   primary key (car_id)
);

/*==============================================================*/
/* Table: car_m                                                 */
/*==============================================================*/
create table car_m
(
   car_id               char(32),
   user_id              char(32)
);

/*==============================================================*/
/* Table: charging_card                                         */
/*==============================================================*/
create table charging_card
(
   charging_card_id     char(32) not null,
   level                int comment 'VIP1
            VIP2
            VIP3
            VIP4
            VIP5
            VIP6',
   state                int comment '0：未激活；1：已激活',
   balance              double(10,2),
   primary key (charging_card_id)
);

/*==============================================================*/
/* Table: charging_pile                                         */
/*==============================================================*/
create table charging_pile
(
   charging_pile_id     char(32) not null,
   charging_station_id  char(32),
   name                 varchar(20),
   type_c               int comment '0汽车充电桩
            1电瓶车充电桩
            2大型公交车充电桩',
   type_v               int comment '0混合型(交直流)
            1直流桩
            2交流桩',
   charging_gun_count   int,
   power                int,
   in_position          text,
   state                int comment '0停用
            1启用',
   detail               text,
   picture              text,
   primary key (charging_pile_id)
);

/*==============================================================*/
/* Table: charging_record                                       */
/*==============================================================*/
create table charging_record
(
   charging_record_id   char(32) not null,
   charging_pile_id     char(32),
   user_id              char(32),
   transaction_flow_id  char(32),
   charging_current     int,
   charging_long        int,
   start_time           datetime,
   state                int comment '0：充电中；1：已结束',
   primary key (charging_record_id)
);

/*==============================================================*/
/* Table: charging_station                                      */
/*==============================================================*/
create table charging_station
(
   charging_station_id  char(32) not null,
   operations_personnel_id char(32),
   billing_rules_id     char(32),
   name                 varchar(20),
   type                 int comment '0混合小型充电站
            1混合中型充电站
            2混合大型充电站
            3小型汽车充电站
            4中型汽车充电站
            5大型汽车充电站
            6小型电瓶车充电站
            7中型电瓶车充电站
            8大型电瓶车充电站',
   address              text,
   state                int comment '1运营中
            0停用中',
   x                    double,
   y                    double,
   start_time           time,
   end_time             time,
   picture              text,
   detail               text,
   car_pile_count       int comment '汽车充电桩数量',
   es_pile_count        int comment '电瓶车充电桩数量',
   bus_pile_count       int comment '大型公交车充电桩数量',
   primary key (charging_station_id)
);

/*==============================================================*/
/* Table: operations_personnel                                  */
/*==============================================================*/
create table operations_personnel
(
   operations_personnel_id char(32) not null,
   name                 varchar(20),
   phone                varchar(11),
   password             varchar(32),
   position             int comment '0：运维工程师；1：高级运维工程师；2：运维主管',
   state                int comment '0：离线；1：在线',
   primary key (operations_personnel_id)
);

alter table operations_personnel comment '运维人员';

/*==============================================================*/
/* Table: recharge_record                                       */
/*==============================================================*/
create table recharge_record
(
   recharge_record_id   char(32) not null,
   user_id              char(32),
   transaction_flow_id  char(32),
   time                 datetime,
   balance              double(10,2),
   state                int comment '0：失败；1：成功',
   primary key (recharge_record_id)
);

/*==============================================================*/
/* Table: reservation                                           */
/*==============================================================*/
create table reservation
(
   charging_pile_id     char(32),
   user_id              char(32),
   reservation_id       char(32),
   start_time           datetime,
  `range`               int
);

/*==============================================================*/
/* Table: task                                                  */
/*==============================================================*/
create table task
(
   task_id              char(32) not null,
   operations_personnel_id char(32),
   charging_station_id  char(32),
   name                 text,
   type                 int comment '0：抢修任务；1：维修任务；2：消警任务',
   plan_start_time      datetime,
   plan_end_time        datetime,
   fact_start_time      datetime,
   fact_end_time        datetime,
   details              text,
   state                int comment '状态（0：待处理；1：处理中；2：已完成；3：已退回）',
   primary key (task_id)
);

alter table task comment '任务';

/*==============================================================*/
/* Table: transaction_flow                                      */
/*==============================================================*/
create table transaction_flow
(
   transaction_flow_id  char(32) not null,
   user_id              char(32),
   transaction_type     int comment '0：退款；1：充电；2：充值',
   pay_type             int comment '0：充电卡；1：微信支付；2：支付宝支付',
   amount               double(10,2),
   state                int comment '0：待支付；1：已完成；2：进行中；3：已取消',
   primary key (transaction_flow_id)
);

/*==============================================================*/
/* Table: user                                                  */
/*==============================================================*/
create table user
(
   user_id              char(32) not null,
   charging_card_id     char(32),
   name                 varchar(20),
   phone                varchar(11),
   id_card              text,
   car_count            int,
   user_type            int comment '0：个人普通用户；1：公司合作用户',
   account              varchar(20),
   password             varchar(20),
   account_type         int comment '0：预付费；1：后付费；2：月结；3：年结',
   state                int comment '0：停用；1：正常',
   primary key (user_id)
);

alter table alarm_msg add constraint FK_Reference_9 foreign key (charging_pile_id)
      references charging_pile (charging_pile_id) on delete restrict on update restrict;

alter table alarm_set add constraint FK_Reference_8 foreign key (charging_pile_id)
      references charging_pile (charging_pile_id) on delete restrict on update restrict;

alter table billing_rules_detail add constraint FK_Reference_23 foreign key (billing_rules_id)
      references billing_rules (billing_rules_id) on delete restrict on update restrict;

alter table car_m add constraint FK_Reference_14 foreign key (car_id)
      references car (car_id) on delete restrict on update restrict;

alter table car_m add constraint FK_Reference_22 foreign key (user_id)
      references user (user_id) on delete restrict on update restrict;

alter table charging_pile add constraint FK_Reference_5 foreign key (charging_station_id)
      references charging_station (charging_station_id) on delete restrict on update restrict;

alter table charging_record add constraint FK_Reference_11 foreign key (charging_pile_id)
      references charging_pile (charging_pile_id) on delete restrict on update restrict;

alter table charging_record add constraint FK_Reference_15 foreign key (user_id)
      references user (user_id) on delete restrict on update restrict;

alter table charging_record add constraint FK_Reference_18 foreign key (transaction_flow_id)
      references transaction_flow (transaction_flow_id) on delete restrict on update restrict;

alter table charging_station add constraint FK_Reference_6 foreign key (billing_rules_id)
      references billing_rules (billing_rules_id) on delete restrict on update restrict;

alter table charging_station add constraint FK_Reference_7 foreign key (operations_personnel_id)
      references operations_personnel (operations_personnel_id) on delete restrict on update restrict;

alter table recharge_record add constraint FK_Reference_17 foreign key (user_id)
      references user (user_id) on delete restrict on update restrict;

alter table recharge_record add constraint FK_Reference_19 foreign key (transaction_flow_id)
      references transaction_flow (transaction_flow_id) on delete restrict on update restrict;

alter table reservation add constraint FK_Reference_10 foreign key (charging_pile_id)
      references charging_pile (charging_pile_id) on delete restrict on update restrict;

alter table reservation add constraint FK_Reference_20 foreign key (user_id)
      references user (user_id) on delete restrict on update restrict;

alter table task add constraint FK_Reference_2 foreign key (operations_personnel_id)
      references operations_personnel (operations_personnel_id) on delete restrict on update restrict;

alter table task add constraint FK_Reference_4 foreign key (charging_station_id)
      references charging_station (charging_station_id) on delete restrict on update restrict;

alter table transaction_flow add constraint FK_Reference_16 foreign key (user_id)
      references user (user_id) on delete restrict on update restrict;

alter table user add constraint FK_Reference_21 foreign key (charging_card_id)
      references charging_card (charging_card_id) on delete restrict on update restrict;