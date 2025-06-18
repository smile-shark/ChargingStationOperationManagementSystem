package com.smileshark.service.imp;

import com.smileshark.common.Result;
import com.smileshark.entity.BillingRules;
import com.smileshark.mapper.BillingRulesMapper;
import com.smileshark.service.BillingRulesService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * <p>
 * 计费规则 服务实现类
 * </p>
 *
 * @author smile鲨鱼
 * @since 2025年06月16日
 */
@Service
@RequiredArgsConstructor
public class BillingRulesServiceImp extends ServiceImpl<BillingRulesMapper, BillingRules> implements BillingRulesService {

    @Override
    public Result<List<BillingRules>> allList() {
        return Result.ok(lambdaQuery().list());
    }
}
