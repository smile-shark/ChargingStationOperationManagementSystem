package com.smileshark.utils;

public class VagueUtil {
    public static String vague(String str) {
        return "%" + String.join("%", str.split("")) + "%";
    }
}
