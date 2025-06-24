package com.smileshark.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.smileshark.common.Result;
import com.smileshark.entity.ChargingRecord;
import com.smileshark.service.ChargingRecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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
@RequestMapping("/chargingRecord")
@RequiredArgsConstructor
public class ChargingRecordController {
    private final ChargingRecordService chargingRecordService;
    @GetMapping("/detailList")
    public Result<Page<ChargingRecord>> detailList(
            @RequestParam Integer page,
            @RequestParam Integer size,
            @RequestParam String param) {
        return chargingRecordService.detailList(page, size, param);
    }
}
