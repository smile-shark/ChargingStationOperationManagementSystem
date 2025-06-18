package com.smileshark.service.imp;

import cn.hutool.core.util.IdUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.smileshark.common.Result;
import com.smileshark.entity.Car;
import com.smileshark.entity.CarM;
import com.smileshark.entity.User;
import com.smileshark.exception.BusinessException;
import com.smileshark.mapper.CarMMapper;
import com.smileshark.mapper.CarMapper;
import com.smileshark.mapper.UserMapper;
import com.smileshark.service.CarService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.smileshark.utils.VagueUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

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
public class CarServiceImp extends ServiceImpl<CarMapper, Car> implements CarService {

    private final CarMapper carMapper;
    private final CarMMapper carMMapper;
    private final UserMapper userMapper;

    @Override
    public Result<Page<Car>> list(Integer page, Integer size, String param) {
        return Result.ok(carMapper.detailCarPage(new Page<>(page, size), VagueUtil.vague(param)));
    }

    @Override
    @Transactional
    public Result<?> add(Car car) {
        String carId = IdUtil.simpleUUID();
        car.setCarId(carId);
        if (save(car)) {
            // 添加车辆数量到用户表，插入车辆中间表
            for (String userId : car.getUserIds()) {
                if (carMMapper.insert(new CarM(carId, userId)) > 0) {
                    if (userMapper.update(new LambdaUpdateWrapper<User>()
                            .setSql("car_count = car_count + 1")
                            .eq(User::getUserId, userId)) == 0) {
                        throw new BusinessException();
                    }
                } else {
                    throw new BusinessException();
                }
            }
        } else {
            throw new BusinessException();
        }
        return Result.ok();
    }

    @Override
    public Result<?> update(Car car) {
        if (car.getUserIds() != null && !car.getUserIds().isEmpty()) {
            // 先查询原有对应的用户信息
            Set<String> oldUserIds = carMMapper.selectList(
                            new LambdaQueryWrapper<CarM>()  // 指定泛型为 CarM
                                    .eq(CarM::getCarId, car.getCarId())
                    )
                    .stream()
                    .map(CarM::getUserId)  // 将 CarM 对象转换为 userId
                    .collect(Collectors.toSet());
            Set<String> newUserIds = new HashSet<>(car.getUserIds());
            // 查找新添加的用户
            List<String> add = newUserIds.stream()
                    .filter(item -> !oldUserIds.contains(item))
                    .toList();
            // 查找被删除的用户
            List<String> remove = oldUserIds.stream()
                    .filter(item -> !newUserIds.contains(item))
                    .toList();
            // 添加数量到新用户
            for (String userId : add) {
                if (userMapper.update(new LambdaUpdateWrapper<User>()
                        .setSql("car_count = car_count + 1")
                        .eq(User::getUserId, userId)) == 0) {
                    throw new BusinessException();
                }
                // 添加中间表数据
                if (carMMapper.insert(new CarM(car.getCarId(), userId)) == 0) {
                    throw new BusinessException();
                }
            }
            // 减少数量到被删除的用户
            for (String userId : remove) {
                if (userMapper.update(new LambdaUpdateWrapper<User>()
                        .setSql("car_count = car_count - 1")
                        .eq(User::getUserId, userId)) == 0) {
                    throw new BusinessException();
                }
                // 删除中间表数据
                if (carMMapper.delete(new LambdaQueryWrapper<CarM>()
                        .eq(CarM::getCarId, car.getCarId())
                        .eq(CarM::getUserId, userId)) == 0) {
                    throw new BusinessException();
                }
            }
        }
        // 更新车辆信息
        updateById(car);
        return Result.ok();
    }

    @Override
    public Result<?> delete(String id) {
        // 先修改用户车辆数据
        // 查询车辆中间表
        List<String> userIds = carMMapper.selectList(
                        new LambdaQueryWrapper<CarM>()  // 指定泛型为 CarM
                                .eq(CarM::getCarId, id)
                )
                .stream()
                .map(CarM::getUserId)  // 将 CarM 对象转换为 userId
                .toList();
        for (String userId : userIds) {
            if (userMapper.update(new LambdaUpdateWrapper<User>()
                    .setSql("car_count = car_count - 1")
                    .eq(User::getUserId, userId)) == 0) {
                throw new BusinessException();
            }
        }
        // 删除中间表的数据
        if (carMMapper.delete(new LambdaQueryWrapper<CarM>()
                .eq(CarM::getCarId, id)) == 0) {
            throw new BusinessException();
        }
        // 删除车辆数据
        if (!removeById(id)) {
            throw new BusinessException();
        }
        return Result.ok();
    }
}
