package com.smileshark.service.imp;

import com.smileshark.common.Result;
import com.smileshark.common.code.ResultCode;
import com.smileshark.entity.Admin;
import com.smileshark.exception.BusinessException;
import com.smileshark.mapper.AdminMapper;
import com.smileshark.service.AdminService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.smileshark.utils.TokenUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * <p>
 *  服务实现类
 * </p>
 *
 * @author smile鲨鱼
 * @since 2025年06月27日
 */
@Service
@RequiredArgsConstructor
public class AdminServiceImp extends ServiceImpl<AdminMapper, Admin> implements AdminService {
    private final TokenUtil tokenUtil;

    @Override
    public Result<Admin> login(Admin admin) {
        Admin one = lambdaQuery().eq(Admin::getAccount, admin.getAccount()).one();
        if(one==null){
            throw new BusinessException(ResultCode.NOT_HAVE_ACCOUNT);
        }
        if(!one.getPassword().equals(admin.getPassword())){
            throw new BusinessException(ResultCode.PASSWORD_NOT_SUCCESS);
        }
        one.setPassword(null);
        one.setToken(tokenUtil.createToken(one));
        return Result.ok(one);
    }
}
