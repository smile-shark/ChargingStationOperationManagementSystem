package com.smileshark.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.smileshark.common.Result;
import com.smileshark.entity.ChargingPile;
import com.baomidou.mybatisplus.extension.service.IService;

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

     Result<?> addData(ChargingPile chargingPile);

     Result<?> updateData(ChargingPile chargingPile);

     Result<?> deleteData(String id);
}
