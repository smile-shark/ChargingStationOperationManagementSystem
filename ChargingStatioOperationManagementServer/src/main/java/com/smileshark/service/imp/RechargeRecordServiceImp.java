package com.smileshark.service.imp;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.smileshark.common.Result;
import com.smileshark.entity.RechargeRecord;
import com.smileshark.mapper.RechargeRecordMapper;
import com.smileshark.service.RechargeRecordService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.smileshark.utils.VagueUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * <p>
 * 充值记录 服务实现类
 * </p>
 *
 * @author smile鲨鱼
 * @since 2025年06月16日
 */
@Service
@RequiredArgsConstructor
public class RechargeRecordServiceImp extends ServiceImpl<RechargeRecordMapper, RechargeRecord> implements RechargeRecordService {

    private final RechargeRecordMapper rechargeRecordMapper;

    @Override
    public Result<Page<RechargeRecord>> detailList(Integer page, Integer size, String param) {
        return Result.ok(rechargeRecordMapper.detailList(new Page<>(page, size), VagueUtil.vague(param)));
    }
}
