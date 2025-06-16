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
 * @since 2025年06月16日
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

    @TableField("transaction_flow_id")
    private String transactionFlowId;

    /**
     * 充电电量（KWH）
     */
    @TableField("charging_current")
    private Integer chargingCurrent;

    @TableField("charging_long")
    private Integer chargingLong;

    @TableField("start_time")
    private LocalDateTime startTime;

    /**
     * 状态（0：充电中；1：已结束）
     */
    @TableField("state")
    private Integer state;
}
