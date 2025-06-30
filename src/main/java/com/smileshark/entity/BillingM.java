package com.smileshark.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import java.io.Serializable;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

/**
 * <p>
 * 规则中间表
 * </p>
 *
 * @author smile鲨鱼
 * @since 2025年06月27日
 */
@Getter
@Setter
@Accessors(chain = true)
@TableName("billing_m")
public class BillingM implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableField("billing_rules_id")
    private String billingRulesId;

    @TableField("charging_station_id")
    private String chargingStationId;
}
