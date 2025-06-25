package com.smileshark.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import java.io.Serializable;
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
@TableName("alarm_set")
public class AlarmSet implements Serializable {

    @TableId(value = "alarm_set_id",type = IdType.ASSIGN_UUID)
    private String alarmSetId;

    @TableField("charging_station_id")
    private String chargingStationId;

    /**
     * 类别（ A相电压 B相电压 C相电压 A相电流 B相电流 C相电流 环境温度 充电枪温度 充电模块温度 绝缘电阻 漏电流）
     */
    @TableField("type")
    private Integer type;

    /**
     * 警告阈值
     */
    @TableField("warning")
    private Double warning;

    /**
     * 严重阈值
     */
    @TableField("serious")
    private Double serious;

    /**
     * 报警延迟
     */
    @TableField("alarm_delay")
    private Double alarmDelay;
}
