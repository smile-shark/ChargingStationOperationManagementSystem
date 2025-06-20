package com.smileshark.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import java.io.Serializable;
import java.time.LocalTime;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

/**
 * <p>
 * 
 * </p>
 *
 * @author smile鲨鱼
 * @since 2025年06月19日
 */
@Getter
@Setter
@Accessors(chain = true)
@TableName("charging_station")
public class ChargingStation implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "charging_station_id", type = IdType.ASSIGN_UUID)
    private String chargingStationId;

    @TableField("operations_personnel_id")
    private String operationsPersonnelId;

    @TableField("name")
    private String name;

    /**
     * 充电站类型（ 0混合小型充电站 1混合中型充电站 2混合大型充电站 3小型汽车充电站 4中型汽车充电站 5大型汽车充电站 6小型电瓶车充电站 7中型电瓶车充电站 8大型电瓶车充电站）
     */
    @TableField("type")
    private Integer type;

    @TableField("address")
    private String address;

    /**
     * 充电站状态（ 1运营中 0停用中 ）
     */
    @TableField("state")
    private Integer state;

    @TableField("x")
    private Double x;

    @TableField("y")
    private Double y;

    @TableField("start_time")
    private LocalTime startTime;

    @TableField("end_time")
    private LocalTime endTime;

    @TableField("picture")
    private String picture;

    @TableField("detail")
    private String detail;

    /**
     * 汽车充电桩数量 
     */
    @TableField("car_pile_count")
    private Integer carPileCount;

    /**
     * 电瓶车充电桩数量
     */
    @TableField("es_pile_count")
    private Integer esPileCount;

    /**
     *  公交车充电桩数量
     */
    @TableField("bus_pile_count")
    private Integer busPileCount;
}
