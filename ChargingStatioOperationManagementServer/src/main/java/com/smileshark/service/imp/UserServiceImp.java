package com.smileshark.service.imp;

import cn.hutool.core.util.IdUtil;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.smileshark.common.Result;
import com.smileshark.common.code.ResultCode;
import com.smileshark.entity.User;
import com.smileshark.exception.BusinessException;
import com.smileshark.mapper.UserMapper;
import com.smileshark.service.UserService;
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
public class UserServiceImp extends ServiceImpl<UserMapper, User> implements UserService {

    @Override
    public Result<List<User>> simpleList() {
        return Result.ok(
                lambdaQuery()
                        .select(
                                User::getUserId, User::getName
                        ).list()
        );
    }

    @Override
    public Result<List<User>> simpleListNotHaveChargingCard() {
        return Result.ok(
                lambdaQuery()
                        .select(User::getUserId, User::getName)
                        .isNull(User::getChargingCardId)
                        .list());
    }

    @Override
    public Result<Page<User>> list(Integer page, Integer size) {
        return Result.ok(lambdaQuery()
                .page(new Page<>(page, size)));
    }

    @Override
    public Result<?> add(User user) {
        user.setUserId(IdUtil.simpleUUID());
        return Result.ok(save(user));
    }

    @Override
    public Result<?> update(User user) {
        // 不能修改充电卡和车辆数
        return Result.ok(lambdaUpdate()
                .eq(User::getUserId, user.getUserId())
                .update(user));
    }

    @Override
    public Result<?> delete(String id) {
        // 如果有相关联的东西丢无法删除用户
        try {
            return Result.ok(removeById(id));
        }catch (Exception e){
            e.printStackTrace();
            throw new BusinessException(ResultCode.NO_CAN_DELETE_USER);
        }
    }
}
