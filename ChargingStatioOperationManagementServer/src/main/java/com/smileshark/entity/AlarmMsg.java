package com.smileshark.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import java.io.Serializable;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

/**
 * <p>
 * 报警消息
 * </p>
 *
 * @author smile鲨鱼
 * @since 2025年06月16日
 */
@Getter
@Setter
@Accessors(chain = true)
@TableName("alarm_msg")
public class AlarmMsg implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "alarm_msg_id", type = IdType.ASSIGN_UUID)
    private String alarmMsgId;

    @TableField("charging_pile_id")
    private String chargingPileId;

    /**
     * 报警类型（ 0电压异常 1电流异常 2温度过高 3绝缘故障 4漏电流 5通信中断 ）
     */
    @TableField("type")
    private Integer type;

    /**
     * 等级程度（0：一般；1：紧急；2：严重） 
     */
    @TableField("level")
    private Integer level;

    @TableField("alarm_time")
    private LocalDateTime alarmTime;

    @TableField("detail")
    private String detail;

    /**
     * 状态（0：未读；1：已读；2：已处理）
     */
    @TableField("state")
    private Integer state;
}
