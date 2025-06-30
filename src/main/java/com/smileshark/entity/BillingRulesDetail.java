package com.smileshark.entity;

import com.baomidou.mybatisplus.annotation.TableField;
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
 * @since 2025年06月27日
 */
@Getter
@Setter
@Accessors(chain = true)
@TableName("billing_rules_detail")
public class BillingRulesDetail implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableField("billing_rules_id")
    private String billingRulesId;

    @TableField("start_time")
    private LocalTime startTime;

    @TableField("end_time")
    private LocalTime endTime;

    /**
     * 收费（￥?/kWh）
     */
    @TableField("price")
    private Double price;
}
