package com.smileshark.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.smileshark.common.Result;
import com.smileshark.entity.User;
import com.smileshark.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * <p>
 *  前端控制器
 * </p>
 *
 * @author smile鲨鱼
 * @since 2025年06月16日
 */
@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    @GetMapping("/simpleList")
    public Result<List<User>> simpleList(){
        return userService.simpleList();
    }
    @GetMapping("/simpleListNotHaveChargingCard")
    public Result<List<User>> simpleListNotHaveChargingCard(){
        return userService.simpleListNotHaveChargingCard();
    }
    @GetMapping
    public Result<Page<User>> list(
            @RequestParam(value = "page", defaultValue = "1") Integer page,
            @RequestParam(value = "size", defaultValue = "10") Integer size
    ) {
        return userService.list(page,size);
    }
    @PostMapping
    public Result<?> add(@RequestBody User user) {
        return userService.add(user);
    }
    @PutMapping
    public Result<?> update(@RequestBody User user) {
        return userService.update(user);
    }
    @DeleteMapping
    public Result<?> delete(@RequestParam("id") String id) {
        return userService.delete(id);
    }
}
