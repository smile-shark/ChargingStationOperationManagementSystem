package com.smileshark.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import java.io.Serializable;
import java.time.LocalDate;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

/**
 * <p>
 * 计费规则
 * </p>
 *
 * @author smile鲨鱼
 * @since 2025年06月27日
 */
@Getter
@Setter
@Accessors(chain = true)
@TableName("billing_rules")
public class BillingRules implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "billing_rules_id", type = IdType.ASSIGN_UUID)
    private String billingRulesId;

    @TableField("name")
    private String name;

    /**
     * 时间范围（0：工作日；1：星期一...7：星期日；8：周某；9节假日）
     */
    @TableField("time_range")
    private Integer timeRange;

    /**
     * 开始日期（节假日） 
     */
    @TableField("start_date")
    private LocalDate startDate;

    /**
     * 结束日期（节假日） 
     */
    @TableField("end_date")
    private LocalDate endDate;

    /**
     * 优先级
     */
    @TableField("order")
    private Integer order;
}
