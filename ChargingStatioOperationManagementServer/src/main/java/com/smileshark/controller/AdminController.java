package com.smileshark.controller;

import com.smileshark.common.Result;
import com.smileshark.entity.Admin;
import com.smileshark.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

/**
 * <p>
 *  前端控制器
 * </p>
 *
 * @author smile鲨鱼
 * @since 2025年06月27日
 */
@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {
    private final AdminService adminService;
    @PostMapping("/login")
    public Result<Admin> login(@RequestBody Admin admin) {
        return adminService.login(admin);
    }
}
