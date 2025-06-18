package com.smileshark.service.imp;

import com.smileshark.common.Result;
import com.smileshark.entity.User;
import com.smileshark.mapper.UserMapper;
import com.smileshark.service.UserService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * <p>
 *  服务实现类
 * </p>
 *
 * @author smile鲨鱼
 * @since 2025年06月16日
 */
@Service
@RequiredArgsConstructor
public class UserServiceImp extends ServiceImpl<UserMapper, User> implements UserService {

    @Override
    public Result<List<User>> simpleList() {
        return Result.ok(
                lambdaQuery()
                        .select(
                                User::getUserId,User::getName
                        ).list()
        );
    }
}
