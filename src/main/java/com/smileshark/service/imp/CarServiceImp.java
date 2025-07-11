package com.smileshark.service.imp;

import com.smileshark.entity.Car;
import com.smileshark.mapper.CarMapper;
import com.smileshark.service.CarService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

/**
 * <p>
 *  服务实现类
 * </p>
 *
 * @author smile鲨鱼
 * @since 2025年06月27日
 */
@Service
public class CarServiceImp extends ServiceImpl<CarMapper, Car> implements CarService {

}
