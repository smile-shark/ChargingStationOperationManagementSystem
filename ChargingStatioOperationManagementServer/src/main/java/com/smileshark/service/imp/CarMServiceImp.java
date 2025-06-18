package com.smileshark.service.imp;

import com.smileshark.common.Result;
import com.smileshark.entity.CarM;
import com.smileshark.mapper.CarMMapper;
import com.smileshark.service.CarMService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * <p>
 *  服务实现类
 * </p>
 *
 * @author smile鲨鱼
 * @since 2025年06月16日
 */
@Service
@RequiredArgsConstructor
public class CarMServiceImp extends ServiceImpl<CarMMapper, CarM> implements CarMService {

    @Override
    public Result<List<String>> getUserIdList(String carId) {
        return Result.ok(lambdaQuery()
                .eq(CarM::getCarId, carId)
                .list()
                .stream()
                .map(CarM::getUserId)
                .toList());
    }
}
