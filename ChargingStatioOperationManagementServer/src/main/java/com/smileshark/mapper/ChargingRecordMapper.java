package com.smileshark.mapper;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.smileshark.entity.ChargingRecord;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

/**
 * <p>
 *  Mapper 接口
 * </p>
 *
 * @author smile鲨鱼
 * @since 2025年06月16日
 */
@Mapper
public interface ChargingRecordMapper extends BaseMapper<ChargingRecord> {
    Page<ChargingRecord> detailList(Page<ChargingRecord> page, @Param("param") String param);
}
