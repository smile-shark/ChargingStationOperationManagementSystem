package com.smileshark.service.imp;

import cn.hutool.core.util.IdUtil;
import com.smileshark.common.Result;
import com.smileshark.entity.AlarmSet;
import com.smileshark.mapper.AlarmSetMapper;
import com.smileshark.service.AlarmSetService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * <p>
 *  服务实现类
 * </p>
 *
 * @author smile鲨鱼
 * @since 2025年06月16日
 */
@Service
@Transactional
public class AlarmSetServiceImp extends ServiceImpl<AlarmSetMapper, AlarmSet> implements AlarmSetService {

    @Override
    public Result<?> saveOrUpdateMY(AlarmSet alarmSet) {
        AlarmSet one = lambdaQuery()
                .eq(AlarmSet::getChargingStationId, alarmSet.getChargingStationId())
                .eq(AlarmSet::getType, alarmSet.getType())
                .one();
        // 如果有就修改
        if(one!=null){
            lambdaUpdate()
                    .eq(AlarmSet::getChargingStationId, alarmSet.getChargingStationId())
                    .eq(AlarmSet::getType,alarmSet.getType())
                    .update(alarmSet);
        }else{
            // 如果没有就新增
            alarmSet.setAlarmSetId(IdUtil.simpleUUID());
            save(alarmSet);
        }

        return Result.ok();
    }
}
