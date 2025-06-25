package com.smileshark.controller;

import cn.hutool.core.util.IdUtil;
import com.smileshark.common.Result;
import com.smileshark.entity.AlarmSet;
import com.smileshark.service.AlarmSetService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * <p>
 *  前端控制器
 * </p>
 *
 * @author smile鲨鱼
 * @since 2025年06月16日
 */
@RestController
@RequestMapping("/alarmSet")
@RequiredArgsConstructor
public class AlarmSetController {
    private final AlarmSetService alarmSetService;
    @PostMapping("/saveOrUpdate")
    public Result<?> saveOrUpdate(@RequestBody AlarmSet alarmSet) {
        return alarmSetService.saveOrUpdateMY(alarmSet);
    }
}
