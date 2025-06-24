package com.smileshark.mapper;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.smileshark.entity.RechargeRecord;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

/**
 * <p>
 * 充值记录 Mapper 接口
 * </p>
 *
 * @author smile鲨鱼
 * @since 2025年06月16日
 */
@Mapper
public interface RechargeRecordMapper extends BaseMapper<RechargeRecord> {
    Page<RechargeRecord> detailList(Page<RechargeRecord> page, @Param("param")String param);
}
