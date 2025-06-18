package com.smileshark.service.imp;

import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.smileshark.common.Result;
import com.smileshark.entity.ChargingCard;
import com.smileshark.entity.User;
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
            chargingCard.setUser(userMapper.selectOne(
                    new LambdaUpdateWrapper<User>()
                            .eq(User::getChargingCardId, chargingCard.getChargingCardId())
            ));
        }

        return Result.ok(pageInfo);
    }
}
