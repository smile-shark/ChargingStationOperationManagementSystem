package com.smileshark.service;

import com.smileshark.common.Result;
import com.smileshark.entity.CarM;
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
public interface CarMService extends IService<CarM> {

     Result<List<String>> getUserIdList(String carId);
}
