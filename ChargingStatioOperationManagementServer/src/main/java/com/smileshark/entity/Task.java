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
 * 浠诲姟
 * </p>
 *
 * @author smile鲨鱼
 * @since 2025年06月16日
 */
@Getter
@Setter
@Accessors(chain = true)
@TableName("task")
public class Task implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "task_id", type = IdType.ASSIGN_UUID)
    private String taskId;

    @TableField("operations_personnel_id")
    private String operationsPersonnelId;

    @TableField("charging_station_id")
    private String chargingStationId;

    @TableField("name")
    private String name;

    /**
     * 任务类型（0：抢修任务；1：维修任务；2：消警任务） 
     */
    @TableField("type")
    private Integer type;

    @TableField("plan_start_time")
    private LocalDateTime planStartTime;

    @TableField("plan_end_time")
    private LocalDateTime planEndTime;

    @TableField("fact_start_time")
    private LocalDateTime factStartTime;

    @TableField("fact_end_time")
    private LocalDateTime factEndTime;

    @TableField("details")
    private String details;

    /**
     * 状态（0：待处理；1：处理中；2：已完成；3：已退回）
     */
    @TableField("state")
    private Integer state;
}
