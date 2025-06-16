package com.smileshark.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.smileshark.common.Result;
import com.smileshark.entity.ChargingPile;
import com.smileshark.service.ChargingPileService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

/**
 * <p>
 * 前端控制器
 * </p>
 *
 * @author smile鲨鱼
 * @since 2025年06月16日
 */
@RestController
@RequestMapping("/chargingPile")
@RequiredArgsConstructor
public class ChargingPileController {
    private final ChargingPileService chargingPileService;

    @GetMapping("/count")
    public Result<Long> count() {
        return Result.ok(chargingPileService.count());
    }

    @GetMapping("/list")
    public Result<Page<ChargingPile>> detailList(
            @RequestParam(value = "page", defaultValue = "1") Integer page,
            @RequestParam(value = "size", defaultValue = "10") Integer size
    ){
        return chargingPileService.detailList(page,size);
    }

    @PostMapping
    public Result<?> add(@RequestBody ChargingPile chargingPile) {
        return chargingPileService.addData(chargingPile);
    }

    @PutMapping
    public Result<?> update(@RequestBody ChargingPile chargingPile) {
        return chargingPileService.updateData(chargingPile);
    }

    @DeleteMapping
    public Result<?> delete(@RequestParam String id) {
        return chargingPileService.deleteData(id);
    }
}
