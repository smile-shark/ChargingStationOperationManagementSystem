package com.smileshark.service.imp;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.smileshark.common.Result;
import com.smileshark.entity.ChargingRecord;
import com.smileshark.mapper.ChargingRecordMapper;
import com.smileshark.service.ChargingRecordService;
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
public class ChargingRecordServiceImp extends ServiceImpl<ChargingRecordMapper, ChargingRecord> implements ChargingRecordService {
    private final ChargingRecordMapper chargingRecordMapper;

    @Override
    public Result<Page<ChargingRecord>> detailList(Integer page, Integer size, String param) {
        return Result.ok(
                chargingRecordMapper.detailList(
                        new Page<>(page, size),
                        VagueUtil.vague(param)
                )
        );
    }
}
