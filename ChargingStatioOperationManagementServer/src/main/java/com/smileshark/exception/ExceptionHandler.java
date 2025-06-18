package com.smileshark.exception;


import com.smileshark.common.Result;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ExceptionHandler{
    @org.springframework.web.bind.annotation.ExceptionHandler(Exception.class)
    public Result<?> handlerException(Exception e){
        e.printStackTrace();
        return Result.no();
    }
    @org.springframework.web.bind.annotation.ExceptionHandler(BusinessException.class)
    public Result<?> handlerBusinessException(BusinessException e){
        e.printStackTrace();
        return Result.no(e.getResultCode());
    }
}
