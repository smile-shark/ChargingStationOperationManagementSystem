package com.smileshark.service.imp;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.smileshark.common.Result;
import com.smileshark.entity.TransactionFlow;
import com.smileshark.mapper.TransactionFlowMapper;
import com.smileshark.service.TransactionFlowService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.smileshark.utils.VagueUtil;
import lombok.RequiredArgsConstructor;
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
@RequiredArgsConstructor
public class TransactionFlowServiceImp extends ServiceImpl<TransactionFlowMapper, TransactionFlow> implements TransactionFlowService {

    private final TransactionFlowMapper transactionFlowMapper;
    @Override
    public Result<Page<TransactionFlow>> detailList(Integer page, Integer size, String param) {
        return Result.ok(transactionFlowMapper.detailList(new Page<>(page,size), VagueUtil.vague(param)));
    }
}
