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
@TableName("charging_card")
public class ChargingCard implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "charging_card_id", type = IdType.ASSIGN_UUID)
    private String chargingCardId;

    /**
     * 会员等级（VIP1 VIP2 VIP3 VIP4 VIP5 VIP6
     */
    @TableField("level")
    private Integer level;

    /**
     * 状态（0：未激活；1：已激活）
     */
    @TableField("state")
    private Integer state;

    @TableField("balance")
    private Double balance;

    @TableField("create_time")
    private LocalDateTime createTime;
}
