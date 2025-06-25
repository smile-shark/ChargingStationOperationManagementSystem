package com.smileshark.common.code;

public enum ResultCode {
    SUCCESS(200, "操作成功"),
    ERROR(450, "操作失败"),
    FAILED(500, "服务器内部错误"),
    NO_CAN_DELETE_USER(500, "不能删除有关联信息的用户"),
    DELETE_OPERATIONS_PERSONNEL_ERROR(500, "该操作人员有关联数据"),
    CHARGING_STATION_NOT_EXIST(500, "充电站不存在" );
    private int code;
    private String msg;

    ResultCode(int code, String message) {
        this.code = code;
        this.msg = message;
    }

    public int getCode() {
        return code;
    }

    public String getMsg() {
        return msg;
    }
}
