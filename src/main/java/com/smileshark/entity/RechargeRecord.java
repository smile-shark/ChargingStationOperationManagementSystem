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
 * 充值记录
 * </p>
 *
 * @author smile鲨鱼
 * @since 2025年06月16日
 */
@Getter
@Setter
@Accessors(chain = true)
@TableName("recharge_record")
public class RechargeRecord implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "recharge_record_id", type = IdType.ASSIGN_UUID)
    private String rechargeRecordId;

    @TableField("user_id")
    private String userId;

    @TableField("transaction_flow_id")
    private String transactionFlowId;

    @TableField("time")
    private LocalDateTime time;

    @TableField("balance")
    private Double balance;

    /**
     * 状态（0：失败；1：成功） 
     */
    @TableField("state")
    private Integer state;
}
