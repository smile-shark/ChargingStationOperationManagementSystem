package com.smileshark.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.smileshark.common.Result;
import com.smileshark.entity.RechargeRecord;
import com.smileshark.service.RechargeRecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * <p>
 * 充值记录 前端控制器
 * </p>
 *
 * @author smile鲨鱼
 * @since 2025年06月16日
 */
@RestController
@RequestMapping("/rechargeRecord")
@RequiredArgsConstructor
public class RechargeRecordController {
    private final RechargeRecordService rechargeRecordService;
    @GetMapping("/detailList")
    public Result<Page<RechargeRecord>> detailList(
            @RequestParam(value = "page", defaultValue = "1") Integer page,
            @RequestParam(value = "size", defaultValue = "10") Integer size,
            @RequestParam String param
    ){
        return rechargeRecordService.detailList(page, size, param);
    }
}
