package com.smileshark.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.smileshark.common.Result;
import com.smileshark.entity.User;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.List;

/**
 * <p>
 *  服务类
 * </p>
 *
 * @author smile鲨鱼
 * @since 2025年06月16日
 */
public interface UserService extends IService<User> {

    Result<List<User>> simpleList();

    Result<List<User>> simpleListNotHaveChargingCard();

    Result<Page<User>> list(Integer page, Integer size);

    Result<?> add(User user);

    Result<?> update(User user);

    Result<?> delete(String id);
}
