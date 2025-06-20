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
 * @since 2025年06月19日
 */
@Getter
@Setter
@Accessors(chain = true)
@TableName("reservation")
public class Reservation implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableField("charging_pile_id")
    private String chargingPileId;

    @TableField("user_id")
    private String userId;

    @TableId(value = "reservation_id", type = IdType.ASSIGN_UUID)
    private String reservationId;

    @TableField("start_time")
    private LocalDateTime startTime;

    @TableField("range")
    private Integer range;

    /**
     * 0已取消，1已完成，2已预约
     */
    @TableField("state")
    private Integer state;
}
