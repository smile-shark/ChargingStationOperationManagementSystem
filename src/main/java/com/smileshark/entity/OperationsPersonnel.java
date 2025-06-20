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
 * 杩愮淮浜哄憳
 * </p>
 *
 * @author smile鲨鱼
 * @since 2025年06月19日
 */
@Getter
@Setter
@Accessors(chain = true)
@TableName("operations_personnel")
public class OperationsPersonnel implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "operations_personnel_id", type = IdType.ASSIGN_UUID)
    private String operationsPersonnelId;

    @TableField("name")
    private String name;

    @TableField("phone")
    private String phone;

    @TableField("password")
    private String password;

    /**
     * 职位（0：运维工程师；1：高级运维工程师；2：运维主管）
     */
    @TableField("position")
    private Integer position;

    /**
     * 状态（0：离线；1：在线）
     */
    @TableField("state")
    private Integer state;
}
