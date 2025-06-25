package com.smileshark.service.imp;

import cn.hutool.core.util.IdUtil;
import com.baomidou.mybatisplus.extension.conditions.query.LambdaQueryChainWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.smileshark.common.Result;
import com.smileshark.common.code.ResultCode;
import com.smileshark.entity.ChargingStation;
import com.smileshark.entity.Task;
import com.smileshark.mapper.ChargingStationMapper;
import com.smileshark.mapper.TaskMapper;
import com.smileshark.service.TaskService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * <p>
 * 浠诲姟 服务实现类
 * </p>
 *
 * @author smile鲨鱼
 * @since 2025年06月16日
 */
@Service
@RequiredArgsConstructor
public class TaskServiceImp extends ServiceImpl<TaskMapper, Task> implements TaskService {
    private final ChargingStationMapper chargingStationMapper;

    @Override
    public Result<Page<Task>> detailList(Integer page, Integer size, Integer state, Integer type) {
        LambdaQueryChainWrapper<Task> wrapper = lambdaQuery();
        if (state != null) {
            wrapper.eq(Task::getState, state);
        }
        if (type != null) {
            wrapper.eq(Task::getType, type);
        }
        return Result.ok(wrapper.page(new Page<>(page, size)));
    }

    @Override
    public Result<?> add(Task task) {
        // 前端添时只会选择充电站，操作人员需要去获取充电站负责人id
        ChargingStation chargingStation = chargingStationMapper.selectById(task.getChargingStationId());
        if (chargingStation == null) {
            return Result.no(ResultCode.CHARGING_STATION_NOT_EXIST);
        }
        task.setOperationsPersonnelId(chargingStation.getOperationsPersonnelId());
        task.setTaskId(IdUtil.simpleUUID());
        return Result.ok(save(task));
    }

    @Override
    public Result<?> update(Task task) {
        return Result.ok(updateById(task));
    }
}
