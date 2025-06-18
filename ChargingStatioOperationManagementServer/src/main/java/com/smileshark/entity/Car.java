package com.smileshark.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import java.io.Serializable;
import java.util.List;

import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

/**
 * <p>
 * 
 * </p>
 *
 * @author smile鲨鱼
 * @since 2025年06月16日
 */
@Getter
@Setter
@Accessors(chain = true)
@TableName("car")
public class Car implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "car_id", type = IdType.ASSIGN_UUID)
    private String carId;

    /**
     * 车牌号 
     */
    @TableField("car_plate")
    private String carPlate;

    /**
     * 品牌型号
     */
    @TableField("model")
    private String model;

    /**
     * 车辆类型（0：纯电；1：混合动力）
     */
    @TableField("type")
    private Integer type;

    @TableField("color")
    private String color;

    /**
     * 电池容量 
     */
    @TableField("battery_capacity")
    private Integer batteryCapacity;

    /**
     * 续航里程
     */
    @TableField("`range`")
    private Integer range;

    /**
     * 状态（0：停用；1：启用）
     */
    @TableField("state")
    private Integer state;

    @TableField(exist = false)
    private String username;
    @TableField(exist = false)
    private List<String> userIds;
}
