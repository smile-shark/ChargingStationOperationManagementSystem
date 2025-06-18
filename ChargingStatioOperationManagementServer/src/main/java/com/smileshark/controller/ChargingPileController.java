package com.smileshark.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.smileshark.common.Result;
import com.smileshark.entity.ChargingPile;
import com.smileshark.service.ChargingPileService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    @GetMapping("/simpleListByChargingStationId")
    public Result<List<ChargingPile>> simpleListByChargingStationId(
            @RequestParam(value = "chargingStationId") String chargingStationId){
        return chargingPileService.simpleListByChargingStationId(chargingStationId);
    }

    @PostMapping("/addOrUpdate")
    public Result<?> addOrUpdate(@RequestBody ChargingPile chargingPile) {
        return chargingPileService.addOrUpdate(chargingPile);
    }


    @DeleteMapping
    public Result<?> delete(@RequestParam String id) {
        return chargingPileService.deleteData(id);
    }

    @GetMapping("/listByChargingStationId")
    public Result<Page<ChargingPile>> listByChargingStationId(
            @RequestParam(value = "page", defaultValue = "1") Integer page,
            @RequestParam(value = "size", defaultValue = "10") Integer size,
            @RequestParam(value = "chargingStationId",required = false) String chargingStationId
    ){
        return chargingPileService.listByChargingStationId(page,size,chargingStationId);
    }
}
