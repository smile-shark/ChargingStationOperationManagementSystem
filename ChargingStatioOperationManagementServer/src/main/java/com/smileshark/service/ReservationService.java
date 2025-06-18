package com.smileshark.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.smileshark.common.Result;
import com.smileshark.entity.Reservation;
import com.baomidou.mybatisplus.extension.service.IService;

/**
 * <p>
 *  服务类
 * </p>
 *
 * @author smile鲨鱼
 * @since 2025年06月16日
 */
public interface ReservationService extends IService<Reservation> {

     Result<Page<Reservation>> detailList(Integer page, Integer size, String param);

     Result<?> delete(String id);

     Result<?> update(Reservation reservation);

     Result<?> add(Reservation reservation);
}
