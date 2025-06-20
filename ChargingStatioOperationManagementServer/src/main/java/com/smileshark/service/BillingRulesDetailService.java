package com.smileshark.service;

import com.smileshark.common.Result;
import com.smileshark.entity.BillingRulesDetail;
import com.baomidou.mybatisplus.extension.service.IService;

/**
 * <p>
 *  服务类
 * </p>
 *
 * @author smile鲨鱼
 * @since 2025年06月16日
 */
public interface BillingRulesDetailService extends IService<BillingRulesDetail> {


     Result<?> add(BillingRulesDetail billingRulesDetail);

     Result<?> update(BillingRulesDetail billingRulesDetail);

     Result<?> delete(String id);
}
