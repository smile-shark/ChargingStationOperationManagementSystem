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
 * @since 2025年06月19日
 */
@Getter
@Setter
@Accessors(chain = true)
@TableName("charging_pile")
public class ChargingPile implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "charging_pile_id", type = IdType.ASSIGN_UUID)
    private String chargingPileId;

    @TableField("charging_station_id")
    private String chargingStationId;

    @TableField("name")
    private String name;

    /**
     * 类别（ 0汽车充电桩 1电瓶车充电桩 2大型公交车充电桩 ）
     */
    @TableField("type_c")
    private Integer typeC;

    /**
     * 类型（ 0混合型(交直流) 1直流桩 2交流桩）
     */
    @TableField("type_v")
    private Integer typeV;

    /**
     * 充电枪数量
     */
    @TableField("charging_gun_count")
    private Integer chargingGunCount;

    /**
     * 功率
     */
    @TableField("power")
    private Integer power;

    /**
     * 安装位置 
     */
    @TableField("in_position")
    private String inPosition;

    /**
     * 状态（0：充电中；1：空闲；2：离线；3：故障
     */
    @TableField("state")
    private Integer state;

    @TableField("detail")
    private String detail;

    @TableField("picture")
    private String picture;
}
