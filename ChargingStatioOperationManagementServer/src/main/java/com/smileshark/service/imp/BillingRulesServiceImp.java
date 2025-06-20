package com.smileshark.service.imp;

import cn.hutool.core.util.IdUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.smileshark.common.Result;
import com.smileshark.entity.BillingM;
import com.smileshark.entity.BillingRules;
import com.smileshark.entity.BillingRulesDetail;
import com.smileshark.exception.BusinessException;
import com.smileshark.mapper.BillingMMapper;
import com.smileshark.mapper.BillingRulesDetailMapper;
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

    private final BillingRulesDetailMapper billingRulesDetailMapper;
    private final BillingMMapper billingMMapper;
    private final BillingRulesMapper billingRulesMapper;


    @Override
    public Result<List<BillingRules>> allList() {
        return Result.ok(lambdaQuery().list());
    }

    @Override
    public Result<List<BillingRules>> detailList(List<Integer> timeRange) {
        return Result.ok(lambdaQuery()
                .in(BillingRules::getTimeRange, timeRange)
                .orderByDesc(BillingRules::getOrder)
                .list()
                .stream()
                .peek(billingRules -> billingRules.setBillingRulesDetails(
                        billingRulesDetailMapper.selectList(
                                new LambdaQueryWrapper<BillingRulesDetail>()
                                        .eq(BillingRulesDetail::getBillingRulesId, billingRules.getBillingRulesId())
                        )
                )).toList());
    }

    @Override
    public Result<BillingRules> add(BillingRules billingRules) {
        // 创建id
        String rulesId = IdUtil.simpleUUID();
        billingRules.setBillingRulesId(rulesId);
        // 设置排序
        Integer maxOrder = billingRulesMapper.selectMaxOrder();
        // 设置新的order值
        billingRules.setOrder(maxOrder != null ? maxOrder + 1 : 1);
        // 保存规则
        if (!save(billingRules)) {
            throw new BusinessException();
        }
        return Result.ok(lambdaQuery()
                .eq(BillingRules::getBillingRulesId, rulesId)
                .one());
    }

    @Override
    public Result<?> update(BillingRules billingRules) {
        // 需要更新规则详细
        // 1. 删除原有详细内容
        billingRulesDetailMapper.delete(new LambdaQueryWrapper<BillingRulesDetail>()
                .eq(BillingRulesDetail::getBillingRulesId, billingRules.getBillingRulesId()));
        // 2. 保存新详细内容
        for (BillingRulesDetail billingRulesDetail : billingRules.getBillingRulesDetails()) {
            billingRulesDetailMapper.insert(billingRulesDetail);
        }
        // 3. 更新其他信息
        lambdaUpdate()
                .eq(BillingRules::getBillingRulesId, billingRules.getBillingRulesId())
                .update(billingRules);
        return Result.ok();
    }

    @Override
    public Result<?> delete(String id) {
        // 删除与充电站关联表中的数据
        billingMMapper.delete(new LambdaQueryWrapper<BillingM>()
                .eq(BillingM::getBillingRulesId, id));
        // 删除规则的详细
        billingRulesDetailMapper.delete(new LambdaQueryWrapper<BillingRulesDetail>()
                .eq(BillingRulesDetail::getBillingRulesId, id));
        // 删除规则
        removeById(id);
        return Result.ok();
    }
}
