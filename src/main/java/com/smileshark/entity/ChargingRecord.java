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
 * 
 * </p>
 *
 * @author smile鲨鱼
 * @since 2025年06月27日
 */
@Getter
@Setter
@Accessors(chain = true)
@TableName("charging_record")
public class ChargingRecord implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "charging_record_id", type = IdType.ASSIGN_UUID)
    private String chargingRecordId;

    @TableField("charging_pile_id")
    private String chargingPileId;

    @TableField("user_id")
    private String userId;

    /**
     * 充电中是没有支付订单的，结束是创建订单
     */
    @TableField("transaction_flow_id")
    private String transactionFlowId;

    /**
     * 充电电量（KWH）结束时计算
     */
    @TableField("charging_current")
    private Integer chargingCurrent;

    /**
     * 充电时长，结束时计算
     */
    @TableField("charging_long")
    private Integer chargingLong;

    /**
     * 开始时间
     */
    @TableField("start_time")
    private LocalDateTime startTime;

    /**
     * 状态（0：充电中；1：已结束）
     */
    @TableField("state")
    private Integer state;
}
