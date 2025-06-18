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
@TableName("reservation")
public class Reservation implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableField("charging_pile_id")
    private String chargingPileId;

    @TableField("user_id")
    private String userId;

    @TableId( type = IdType.ASSIGN_UUID, value = "reservation_id")
    private String reservationId;

    @TableField("start_time")
    private LocalDateTime startTime;

    @TableField("`range`")
    private Integer range;

    private Integer state; //0已取消，1已完成，1已预

    @TableField(exist = false)
    private String chargingStationName;
    @TableField(exist = false)
    private String chargingPileName;
    @TableField(exist = false)
    private String username;

}
