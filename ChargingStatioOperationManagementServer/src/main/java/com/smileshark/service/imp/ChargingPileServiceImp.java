package com.smileshark.service.imp;

import cn.hutool.core.util.IdUtil;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.smileshark.common.Result;
import com.smileshark.entity.ChargingPile;
import com.smileshark.entity.ChargingStation;
import com.smileshark.exception.BusinessException;
import com.smileshark.mapper.ChargingPileMapper;
import com.smileshark.mapper.ChargingStationMapper;
import com.smileshark.service.ChargingPileService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.smileshark.service.ChargingStationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

    private static final Map<Integer, String> TYPE_TO_FIELD = new HashMap<>();

    static {
        TYPE_TO_FIELD.put(0, "car_pile_count");
        TYPE_TO_FIELD.put(1, "es_pile_count");
        TYPE_TO_FIELD.put(2, "bus_pile_count");
    }

    @Override
    public Result<Page<ChargingPile>> detailList(Integer page, Integer size) {
        return Result.ok(lambdaQuery().page(new Page<>(page, size)));
    }

    @Override
    public Result<?> deleteData(String id) {
        ChargingPile chargingPile = lambdaQuery().eq(ChargingPile::getChargingPileId, id).one();
        if (chargingPileMapper.deleteById(id) > 0) {
            updateStationCount(chargingPile.getChargingStationId(), chargingPile.getTypeC(), -1);
        }
        return Result.ok();
    }

    @Override
    public Result<Page<ChargingPile>> listByChargingStationId(Integer page, Integer size, String chargingStationId) {
        Page<ChargingPile> info;
        if (chargingStationId != null && !chargingStationId.isEmpty()) {
            info = lambdaQuery().eq(ChargingPile::getChargingStationId, chargingStationId).page(new Page<>(page, size));
        } else {
            info = lambdaQuery().page(new Page<>(page, size));
        }
        return Result.ok(info);
    }

    @Override
    @Transactional
    public Result<?> addOrUpdate(ChargingPile chargingPile) {
        if (chargingPile.getChargingPileId() == null || chargingPile.getChargingPileId().isEmpty()) {
            chargingPile.setChargingPileId(IdUtil.simpleUUID());
            updateStationCount(chargingPile.getChargingStationId(), chargingPile.getTypeC(), 1);
        } else {
            ChargingPile existingPile = lambdaQuery().eq(ChargingPile::getChargingPileId, chargingPile.getChargingPileId()).one();
            if (existingPile != null && !existingPile.getTypeC().equals(chargingPile.getTypeC())) {
                updateStationCount(chargingPile.getChargingStationId(), existingPile.getTypeC(), -1);
                updateStationCount(chargingPile.getChargingStationId(), chargingPile.getTypeC(), 1);
            }
        }

        if (saveOrUpdate(chargingPile)) {
            return Result.ok(true);
        }
        throw new BusinessException();
    }

    @Override
    public Result<List<ChargingPile>> simpleListByChargingStationId(String chargingStationId) {
        return Result.ok(lambdaQuery()
                .select(ChargingPile::getChargingPileId, ChargingPile::getName)
                .eq(ChargingPile::getChargingStationId, chargingStationId)
                .list());
    }

    @Override
    public Result<List<ChargingPile>> allList(String chargingStationId) {
        return Result.ok(lambdaQuery().eq(ChargingPile::getChargingStationId, chargingStationId).list());
    }

    /**
     * 更新充电站中对应类型充电桩的数量
     * @param stationId 充电站ID
     * @param type 充电桩类型
     * @param delta 数量变化(正数为增加，负数为减少)
     */
    private void updateStationCount(String stationId, Integer type, int delta) {
        String fieldName = TYPE_TO_FIELD.get(type);
        if (fieldName != null) {
            chargingStationService.lambdaUpdate()
                    .setSql(String.format("%s = %s + %d", fieldName, fieldName, delta))
                    .eq(ChargingStation::getChargingStationId, stationId)
                    .update();
        }
    }
}
