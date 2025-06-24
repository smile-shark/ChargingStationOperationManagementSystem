package com.smileshark.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.smileshark.common.Result;
import com.smileshark.entity.RechargeRecord;
import com.baomidou.mybatisplus.extension.service.IService;

/**
 * <p>
 * 充值记录 服务类
 * </p>
 *
 * @author smile鲨鱼
 * @since 2025年06月16日
 */
public interface RechargeRecordService extends IService<RechargeRecord> {

    Result<Page<RechargeRecord>> detailList(Integer page, Integer size, String param);
}
