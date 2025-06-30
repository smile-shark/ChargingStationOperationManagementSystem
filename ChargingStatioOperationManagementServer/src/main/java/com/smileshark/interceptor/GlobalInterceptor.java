package com.smileshark.interceptor;

import com.smileshark.common.code.ResultCode;
import com.smileshark.entity.Admin;
import com.smileshark.exception.BusinessException;
import com.smileshark.utils.ThreadLocalInfo;
import com.smileshark.utils.TokenUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
@RequiredArgsConstructor
public class GlobalInterceptor implements HandlerInterceptor {
    @Autowired
    private TokenUtil tokenUtil;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        System.out.println(request.getRequestURL());
        String token = tokenUtil.removeBearer(request.getHeader("Authorization"));
        System.out.println("token = " + token);
        try {
            if (!tokenUtil.verifyToken(token)) {
                throw new BusinessException(ResultCode.TOKEN_INVALID);
            }
            ThreadLocalInfo.setAdmin(tokenUtil.parseToken(token, Admin.class));
        } catch (Exception e) {
            throw new BusinessException(ResultCode.TOKEN_INVALID);
        }
        return true;
    }
}
