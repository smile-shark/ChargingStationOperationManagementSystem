package com.smileshark.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.smileshark.common.Result;
import com.smileshark.entity.AlarmMsg;
import com.smileshark.service.AlarmMsgService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

/**
 * <p>
 * 报警消息 前端控制器
 * </p>
 *
 * @author smile鲨鱼
 * @since 2025年06月16日
 */
@RestController
@RequestMapping("/alarmMsg")
@RequiredArgsConstructor
public class AlarmMsgController {
    private final AlarmMsgService alarmMsgService;
    @GetMapping("/detailList")
    public Result<Page<AlarmMsg>> detailList(
            @RequestParam(value = "page", defaultValue = "1") Integer page,
            @RequestParam(value = "size", defaultValue = "10") Integer size,
            @RequestParam String param
    ){
        return alarmMsgService.detailList(page, size, param);
    }
    @PutMapping
    public Result<?> update(@RequestBody AlarmMsg alarmMsg){
        return alarmMsgService.update(alarmMsg);
    }
}
