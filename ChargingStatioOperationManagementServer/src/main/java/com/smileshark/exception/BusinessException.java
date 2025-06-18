package com.smileshark.exception;

import com.smileshark.common.code.ResultCode;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
public class BusinessException extends RuntimeException{

    private String msg;
    private Integer code;
    private ResultCode resultCode;

    public BusinessException(ResultCode resultCode) {
        super(resultCode.getMsg());
        this.msg=resultCode.getMsg();
        this.code=resultCode.getCode();
        this.resultCode=resultCode;
    }
    public BusinessException() {
        super(ResultCode.ERROR.getMsg());
        this.msg=ResultCode.ERROR.getMsg();
        this.code=ResultCode.ERROR.getCode();
    }
}
