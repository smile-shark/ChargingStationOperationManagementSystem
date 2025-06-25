package com.smileshark.service.imp;

import cn.hutool.core.util.IdUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.conditions.query.LambdaQueryChainWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.smileshark.common.Result;
import com.smileshark.common.code.ResultCode;
import com.smileshark.entity.OperationsPersonnel;
import com.smileshark.exception.BusinessException;
import com.smileshark.mapper.OperationsPersonnelMapper;
import com.smileshark.service.OperationsPersonnelService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.smileshark.utils.VagueUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * <p>
 * 杩愮淮浜哄憳 服务实现类
 * </p>
 *
 * @author smile鲨鱼
 * @since 2025年06月16日
 */
@Service
@RequiredArgsConstructor
public class OperationsPersonnelServiceImp extends ServiceImpl<OperationsPersonnelMapper, OperationsPersonnel> implements OperationsPersonnelService {

    @Override
    public Result<List<OperationsPersonnel>> simpleList() {
        return Result.ok(lambdaQuery()
                .select(
                        OperationsPersonnel::getOperationsPersonnelId,
                        OperationsPersonnel::getName
                ).list());
    }

    @Override
    public Result<Page<OperationsPersonnel>> detailList(Integer page, Integer size, String param, Integer state) {
        // 如果stat为空就不使用这个条件
        LambdaQueryChainWrapper<OperationsPersonnel> queryWrapper = lambdaQuery()
                .nested(wq -> wq.like(OperationsPersonnel::getName, VagueUtil.vague(param))
                        .or()
                        .like(OperationsPersonnel::getOperationsPersonnelId, VagueUtil.vague(param))
                        .or()
                        .like(OperationsPersonnel::getPhone, VagueUtil.vague(param)));
        if (state != null) {
            queryWrapper.eq(OperationsPersonnel::getState, state);
        }
        return Result.ok(queryWrapper.page(new Page<>(page, size)));
    }

    @Override
    public Result<?> add(OperationsPersonnel operationsPersonnel) {
        operationsPersonnel.setOperationsPersonnelId(IdUtil.simpleUUID());
        return Result.ok(save(operationsPersonnel));
    }

    @Override
    public Result<?> update(OperationsPersonnel operationsPersonnel) {
        return Result.ok(lambdaUpdate()
                .eq(OperationsPersonnel::getOperationsPersonnelId,operationsPersonnel.getOperationsPersonnelId())
                .update(operationsPersonnel));
    }

    @Override
    public Result<?> delete(String id) {
        try{
            removeById(id);
            return Result.ok();
        }catch (Exception e){
            throw new BusinessException(ResultCode.DELETE_OPERATIONS_PERSONNEL_ERROR);
        }
    }
}
