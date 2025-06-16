package com.smileshark.service.imp;

import cn.hutool.core.util.IdUtil;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.smileshark.common.Result;
import com.smileshark.entity.ChargingPile;
import com.smileshark.entity.ChargingStation;
import com.smileshark.mapper.ChargingPileMapper;
import com.smileshark.mapper.ChargingStationMapper;
import com.smileshark.service.ChargingPileService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.smileshark.service.ChargingStationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

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
public class ChargingPileServiceImp extends ServiceImpl<ChargingPileMapper, ChargingPile> implements ChargingPileService {
    private final ChargingPileMapper chargingPileMapper;
    private final ChargingStationService chargingStationService;

    @Override
    public Result<Page<ChargingPile>> detailList(Integer page, Integer size) {
        return Result.ok(lambdaQuery().page(new Page<>(page, size)));
    }

    @Override
    public Result<?> addData(ChargingPile chargingPile) {
        chargingPile.setChargingPileId(IdUtil.simpleUUID());
        if (save(chargingPile)) {
            // 新增充电桩成功后，添加充电站中的数量
            switch (chargingPile.getTypeC()) {
                case 0:
                    chargingStationService.lambdaUpdate()
                            .setSql("car_pile_count = car_pile_count + 1")
                            .eq(ChargingStation::getChargingStationId,chargingPile.getChargingStationId());
                    break;
                case 1:
                    chargingStationService.lambdaUpdate()
                            .setSql("es_pile_count = es_pile_count + 1")
                            .eq(ChargingStation::getChargingStationId,chargingPile.getChargingStationId());
                    break;
                case 2:
                    chargingStationService.lambdaUpdate()
                            .setSql("bus_pile_count = bus_pile_count + 1")
                            .eq(ChargingStation::getChargingStationId,chargingPile.getChargingStationId());
                    break;
            }
        }
        return Result.ok(true);
    }

    @Override
    public Result<?> updateData(ChargingPile chargingPile) {
        return Result.ok(lambdaUpdate().update(chargingPile));
    }

    @Override
    public Result<?> deleteData(String id) {
        return Result.ok(chargingPileMapper.deleteById(id));
    }
}
