package com.smileshark.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.smileshark.common.Result;
import com.smileshark.entity.ChargingPile;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.List;

/**
 * <p>
 *  服务类
 * </p>
 *
 * @author smile鲨鱼
 * @since 2025年06月16日
 */
public interface ChargingPileService extends IService<ChargingPile> {

     Result<Page<ChargingPile>> detailList(Integer page, Integer size);

     Result<?> deleteData(String id);

    Result<Page<ChargingPile>> listByChargingStationId(Integer page, Integer size, String chargingStationId);

    Result<?> addOrUpdate(ChargingPile chargingPile);

    Result<List<ChargingPile>> simpleListByChargingStationId(String chargingStationId);
}
