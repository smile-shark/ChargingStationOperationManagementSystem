package com.smileshark.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.smileshark.common.Result;
import com.smileshark.entity.Task;
import com.baomidou.mybatisplus.extension.service.IService;

/**
 * <p>
 * 浠诲姟 服务类
 * </p>
 *
 * @author smile鲨鱼
 * @since 2025年06月16日
 */
public interface TaskService extends IService<Task> {

    Result<Page<Task>> detailList(Integer page, Integer size, Integer state, Integer type);

    Result<?> add(Task task);

    Result<?> update(Task task);
}
