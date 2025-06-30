package com.smileshark.utils;

import com.smileshark.entity.Admin;

public class ThreadLocalInfo {
    private static final ThreadLocal<Admin> threadLocal = new ThreadLocal<>();

    public static void setAdmin(Admin admin) {
        threadLocal.set(admin);
    }

    public static Admin getAdmin() {
        return threadLocal.get();
    }
}
