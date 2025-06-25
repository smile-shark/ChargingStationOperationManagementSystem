package com.smileshark.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.smileshark.common.Result;
import com.smileshark.entity.OperationsPersonnel;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.List;

/**
 * <p>
 * 杩愮淮浜哄憳 服务类
 * </p>
 *
 * @author smile鲨鱼
 * @since 2025年06月16日
 */
public interface OperationsPersonnelService extends IService<OperationsPersonnel> {

    Result<List<OperationsPersonnel>> simpleList();

    Result<Page<OperationsPersonnel>> detailList(Integer page, Integer size, String param, Integer state);

    Result<?> add(OperationsPersonnel operationsPersonnel);

    Result<?> update(OperationsPersonnel operationsPersonnel);

    Result<?> delete(String id);
}
