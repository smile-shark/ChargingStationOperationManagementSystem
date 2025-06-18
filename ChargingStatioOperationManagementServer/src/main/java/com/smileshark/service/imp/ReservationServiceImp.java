package com.smileshark.service.imp;

import cn.hutool.core.util.IdUtil;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.smileshark.common.Result;
import com.smileshark.entity.ChargingStation;
import com.smileshark.entity.Reservation;
import com.smileshark.mapper.ReservationMapper;
import com.smileshark.service.ChargingPileService;
import com.smileshark.service.ChargingStationService;
import com.smileshark.service.ReservationService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.smileshark.service.UserService;
import com.smileshark.utils.VagueUtil;
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
public class ReservationServiceImp extends ServiceImpl<ReservationMapper, Reservation> implements ReservationService {

    private final ChargingPileService chargingPileService;
    private final ChargingStationService chargingStationService;
    private final UserService userService;
    private final ReservationMapper reservationMapper;

    @Override
    public Result<Page<Reservation>> detailList(Integer page, Integer size, String param) {;
        // 参数可能是充电桩名称 充电桩编号 用户名称 充电站名称
        return Result.ok(reservationMapper.detailList(new Page<>(page, size), VagueUtil.vague(param)));
    }

    @Override
    public Result<?> delete(String id) {
        return Result.ok(reservationMapper.deleteById(id));
    }

    @Override
    public Result<?> update(Reservation reservation) {
        return Result.ok(lambdaUpdate()
                .eq(Reservation::getReservationId,reservation.getReservationId())
                .update(reservation));
    }

    @Override
    public Result<?> add(Reservation reservation) {
        reservation.setReservationId(IdUtil.simpleUUID());
        return Result.ok(save(reservation));
    }
}
