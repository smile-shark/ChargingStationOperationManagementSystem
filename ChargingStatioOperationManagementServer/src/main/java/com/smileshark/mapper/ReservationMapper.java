package com.smileshark.mapper;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.smileshark.entity.Reservation;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * <p>
 *  Mapper 接口
 * </p>
 *
 * @author smile鲨鱼
 * @since 2025年06月16日
 */
@Mapper
public interface ReservationMapper extends BaseMapper<Reservation> {
   Page<Reservation> detailList(Page<Reservation> page,@Param("param") String param);
}
