package com.smileshark.service;

import com.smileshark.common.Result;
import com.smileshark.entity.AlarmSet;
import com.baomidou.mybatisplus.extension.service.IService;

/**
 * <p>
 *  服务类
 * </p>
 *
 * @author smile鲨鱼
 * @since 2025年06月16日
 */
public interface AlarmSetService extends IService<AlarmSet> {

    Result<?> saveOrUpdateMY(AlarmSet alarmSet);
}
