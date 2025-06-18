package com.smileshark.service;

import com.smileshark.common.Result;
import com.smileshark.entity.BillingRules;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.List;

/**
 * <p>
 * 计费规则 服务类
 * </p>
 *
 * @author smile鲨鱼
 * @since 2025年06月16日
 */
public interface BillingRulesService extends IService<BillingRules> {

    Result<List<BillingRules>> allList();
}
