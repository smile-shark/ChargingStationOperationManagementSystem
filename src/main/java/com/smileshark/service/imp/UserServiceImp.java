package com.smileshark.service.imp;

import com.smileshark.entity.User;
import com.smileshark.mapper.UserMapper;
import com.smileshark.service.UserService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

/**
 * <p>
 *  服务实现类
 * </p>
 *
 * @author smile鲨鱼
 * @since 2025年06月19日
 */
@Service
public class UserServiceImp extends ServiceImpl<UserMapper, User> implements UserService {

}
