package com.smileshark.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.smileshark.common.Result;
import com.smileshark.entity.ChargingStation;
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
public interface ChargingStationService extends IService<ChargingStation> {

    Result<List<ChargingStation>> simpleList();

    Result<Page<ChargingStation>> detailList(Integer page, Integer size);

    Result<?> addData(ChargingStation chargingStation);

    Result<?> updateData(ChargingStation chargingStation);

    Result<?> deleteData(String id);
}
