package com.smileshark.mapper;

import com.smileshark.entity.BillingRules;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

/**
 * <p>
 * 计费规则 Mapper 接口
 * </p>
 *
 * @author smile鲨鱼
 * @since 2025年06月16日
 */
@Mapper
public interface BillingRulesMapper extends BaseMapper<BillingRules> {
    // 查询最大 order 值
    @Select("SELECT MAX(`order`) FROM billing_rules")
    Integer selectMaxOrder();
}
