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
 * @since 2025年06月16日
 */
@Getter
@Setter
@Accessors(chain = true)
@TableName("user")
public class User implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "user_id", type = IdType.ASSIGN_UUID)
    private String userId;

    @TableField("charging_card_id")
    private String chargingCardId;

    @TableField("name")
    private String name;

    @TableField("phone")
    private String phone;

    @TableField("id_card")
    private String idCard;

    @TableField("car_count")
    private Integer carCount;

    /**
     * 客户类型（0：个人普通用户；1：公司合作用户） 
     */
    @TableField("user_type")
    private Integer userType;

    /**
     * 账户类型（0：预付费；1：后付费；2：月结；3：年结) 
     */
    @TableField("account")
    private String account;

    @TableField("password")
    private String password;

    /**
     * 0锛氶?浠樿垂锛?锛氬悗浠樿垂锛?锛氭湀缁擄紱3锛氬勾缁
     */
    @TableField("account_type")
    private Integer accountType;

    /**
     * 状态（0：停用；1：正常）
     */
    @TableField("state")
    private Integer state;
}
