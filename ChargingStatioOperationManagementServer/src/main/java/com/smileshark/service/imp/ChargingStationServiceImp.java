package com.smileshark.service.imp;

import cn.hutool.core.util.IdUtil;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.smileshark.common.Result;
import com.smileshark.entity.ChargingStation;
import com.smileshark.mapper.ChargingStationMapper;
import com.smileshark.service.ChargingStationService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * <p>
 * 服务实现类
 * </p>
 *
 * @author smile鲨鱼
 * @since 2025年06月16日
 */
@Service
@RequiredArgsConstructor
public class ChargingStationServiceImp extends ServiceImpl<ChargingStationMapper, ChargingStation> implements ChargingStationService {
    private final ChargingStationMapper chargingStationMapper;

    @Override
    public Result<List<ChargingStation>> simpleList() {
        // 简单消息 id,name,state,x,y
        return Result.ok(lambdaQuery()
                .select(ChargingStation::getChargingStationId,
                        ChargingStation::getName,
                        ChargingStation::getState,
                        ChargingStation::getX,
                        ChargingStation::getY)
                .list());
    }

    @Override
    public Result<Page<ChargingStation>> detailList(Integer page, Integer size) {
        return Result.ok(page(new Page<>(page, size)));
    }

    @Override
    public Result<?> addData(ChargingStation chargingStation) {
        // 生成一个id
        chargingStation.setChargingStationId(IdUtil.simpleUUID());
        return Result.ok(save(chargingStation));
    }

    @Override
    public Result<?> updateData(ChargingStation chargingStation) {
        return Result.ok(lambdaUpdate()
                .eq(ChargingStation::getChargingStationId, chargingStation.getChargingStationId())
                .update(chargingStation));
    }

    @Override
    public Result<?> deleteData(String id) {
        return Result.ok(chargingStationMapper.deleteById(id));
    }

}
