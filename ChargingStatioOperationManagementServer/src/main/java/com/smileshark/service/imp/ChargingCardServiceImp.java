package com.smileshark.service.imp;

import cn.hutool.core.util.IdUtil;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.smileshark.common.Result;
import com.smileshark.entity.ChargingCard;
import com.smileshark.entity.User;
import com.smileshark.exception.BusinessException;
import com.smileshark.mapper.ChargingCardMapper;
import com.smileshark.mapper.UserMapper;
import com.smileshark.service.ChargingCardService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

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
public class ChargingCardServiceImp extends ServiceImpl<ChargingCardMapper, ChargingCard> implements ChargingCardService {

    private final UserMapper userMapper;

    @Override
    public Result<Page<ChargingCard>> list(Integer page, Integer size) {
        Page<ChargingCard> pageInfo = lambdaQuery().page(new Page<>(page, size));
        // 获取对应的用户数据
        for (ChargingCard chargingCard : pageInfo.getRecords()) {
            User user = userMapper.selectOne(
                    new LambdaUpdateWrapper<User>()
                            .eq(User::getChargingCardId, chargingCard.getChargingCardId())
            );
            chargingCard.setUser(user);
            chargingCard.setUserId(user.getUserId());
        }

        return Result.ok(pageInfo);
    }

    @Override
    public Result<?> add(ChargingCard chargingCard) {
        // 添加充电机卡数据
        String chargingCardId = IdUtil.simpleUUID();
        chargingCard.setChargingCardId(chargingCardId);
        if (!save(chargingCard)) {
            throw new BusinessException();
        }
        // 充电卡绑定用户
        if (userMapper.update(new LambdaUpdateWrapper<User>()
                .set(User::getChargingCardId, chargingCardId)
                .eq(User::getUserId, chargingCard.getUserId())) == 0) {
            throw new BusinessException();
        }
        return Result.ok();
    }

    @Override
    public Result<?> update(ChargingCard chargingCard) {
        // 卡信息修改不能修改绑定用户
        if (!lambdaUpdate()
                .eq(ChargingCard::getChargingCardId, chargingCard.getChargingCardId())
                .update(chargingCard)) {
            throw new BusinessException();
        }

        return Result.ok();
    }

    @Override
    public Result<?> delete(String id) {
        // 删除时一并删除用户绑定
        if (userMapper.update(new LambdaUpdateWrapper<User>()
                .set(User::getChargingCardId, null)
                .eq(User::getChargingCardId,id))==0) {
            throw new BusinessException();
        }
        // 删除充电卡
        if (!removeById(id)) {
            throw new BusinessException();
        }
        return Result.ok();
    }
}
