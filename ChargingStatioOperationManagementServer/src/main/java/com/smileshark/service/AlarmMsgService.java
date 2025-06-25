package com.smileshark.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.smileshark.common.Result;
import com.smileshark.entity.AlarmMsg;
import com.baomidou.mybatisplus.extension.service.IService;

/**
 * <p>
 * 报警消息 服务类
 * </p>
 *
 * @author smile鲨鱼
 * @since 2025年06月16日
 */
public interface AlarmMsgService extends IService<AlarmMsg> {

    Result<Page<AlarmMsg>> detailList(Integer page, Integer size, String param);

    Result<?> update(AlarmMsg alarmMsg);
}
