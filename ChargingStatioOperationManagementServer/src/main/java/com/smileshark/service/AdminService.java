package com.smileshark.service;

import com.smileshark.common.Result;
import com.smileshark.entity.Admin;
import com.baomidou.mybatisplus.extension.service.IService;

/**
 * <p>
 *  服务类
 * </p>
 *
 * @author smile鲨鱼
 * @since 2025年06月27日
 */
public interface AdminService extends IService<Admin> {

    Result<Admin> login(Admin admin);
}
