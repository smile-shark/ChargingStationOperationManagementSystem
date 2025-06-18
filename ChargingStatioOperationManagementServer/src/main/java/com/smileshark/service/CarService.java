package com.smileshark.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.smileshark.common.Result;
import com.smileshark.entity.Car;
import com.baomidou.mybatisplus.extension.service.IService;

/**
 * <p>
 *  服务类
 * </p>
 *
 * @author smile鲨鱼
 * @since 2025年06月16日
 */
public interface CarService extends IService<Car> {

    Result<Page<Car>> list(Integer page, Integer size, String param);

    Result<?> add(Car car);

    Result<?> update(Car car);

    Result<?> delete(String id);
}
