package com.smileshark.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.smileshark.common.Result;
import com.smileshark.entity.Task;
import com.smileshark.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

/**
 * <p>
 * 浠诲姟 前端控制器
 * </p>
 *
 * @author smile鲨鱼
 * @since 2025年06月16日
 */
@RestController
@RequestMapping("/task")
@RequiredArgsConstructor
public class TaskController {
    private final TaskService taskService;
    @GetMapping("/detailList")
    public Result<Page<Task>> detailList(
            @RequestParam(value = "page", defaultValue = "1") Integer page,
            @RequestParam(value = "size",defaultValue = "10") Integer size,
            @RequestParam(value = "state",required = false) Integer state,
            @RequestParam(value = "type",required = false)Integer type
    ) {
        return taskService.detailList(page, size, state, type);
    }
    @PostMapping
    public Result<?> add(@RequestBody Task task) {
        return taskService.add(task);
    }
    @PutMapping
    public Result<?> update(@RequestBody Task task) {
        return taskService.update(task);
    }
}
