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
 * @since 2025年06月27日
 */
@Getter
@Setter
@Accessors(chain = true)
@TableName("transaction_flow")
public class TransactionFlow implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "transaction_flow_id", type = IdType.ASSIGN_UUID)
    private String transactionFlowId;

    @TableField("user_id")
    private String userId;

    /**
     * 交易类型（0：退款；1：充电；2：充值）
     */
    @TableField("transaction_type")
    private Integer transactionType;

    /**
     * 支付方式（0：充电卡；1：微信支付；2：支付宝支付） 
     */
    @TableField("pay_type")
    private Integer payType;

    @TableField("amount")
    private Double amount;

    /**
     * 状态（0：待支付；1：已完成；2：进行中；3：已取消）
     */
    @TableField("state")
    private Integer state;
}
