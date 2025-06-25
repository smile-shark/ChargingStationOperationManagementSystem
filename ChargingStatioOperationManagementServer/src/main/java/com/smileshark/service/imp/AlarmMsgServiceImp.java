package com.smileshark.service.imp;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.smileshark.common.Result;
import com.smileshark.entity.AlarmMsg;
import com.smileshark.mapper.AlarmMsgMapper;
import com.smileshark.service.AlarmMsgService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.smileshark.utils.VagueUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * <p>
 * 报警消息 服务实现类
 * </p>
 *
 * @author smile鲨鱼
 * @since 2025年06月16日
 */
@Service
@RequiredArgsConstructor
public class AlarmMsgServiceImp extends ServiceImpl<AlarmMsgMapper, AlarmMsg> implements AlarmMsgService {
    private final AlarmMsgMapper alarmMsgMapper;
    @Override
    public Result<Page<AlarmMsg>> detailList(Integer page, Integer size, String param) {
        return Result.ok(alarmMsgMapper.detailList(
                new Page<>(page,size),
                VagueUtil.vague(param)
        ));
    }

    @Override
    public Result<?> update(AlarmMsg alarmMsg) {
        return Result.ok(lambdaUpdate()
                .eq(AlarmMsg::getAlarmMsgId,alarmMsg.getAlarmMsgId())
                .update(alarmMsg));
    }
}
