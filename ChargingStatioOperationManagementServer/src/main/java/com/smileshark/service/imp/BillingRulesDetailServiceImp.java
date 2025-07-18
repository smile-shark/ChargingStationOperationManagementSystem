package com.smileshark.service.imp;

import com.smileshark.common.Result;
import com.smileshark.entity.BillingRulesDetail;
import com.smileshark.mapper.BillingRulesDetailMapper;
import com.smileshark.service.BillingRulesDetailService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

/**
 * <p>
 *  服务实现类
 * </p>
 *
 * @author smile鲨鱼
 * @since 2025年06月16日
 */
@Service
public class BillingRulesDetailServiceImp extends ServiceImpl<BillingRulesDetailMapper, BillingRulesDetail> implements BillingRulesDetailService {

    @Override
    public Result<?> add(BillingRulesDetail billingRulesDetail) {
        return null;
    }

    @Override
    public Result<?> update(BillingRulesDetail billingRulesDetail) {
        return null;
    }

    @Override
    public Result<?> delete(String id) {
        return null;
    }
}
