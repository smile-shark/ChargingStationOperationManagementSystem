package com.smileshark.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.smileshark.common.Result;
import com.smileshark.entity.ChargingStation;
import com.smileshark.service.ChargingStationService;
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
@RequestMapping("/chargingStation")
@RequiredArgsConstructor
public class ChargingStationController {
    private final ChargingStationService chargingStationService;
    @GetMapping("/simpleList")
    public Result<List<ChargingStation>> simpleList(){
        return chargingStationService.simpleList();
    }
    @GetMapping("/count")
    public Result<Long> count(){
        return Result.ok(chargingStationService.count());
    }
    @GetMapping("/list")
    public Result<Page<ChargingStation>> detailList(
            @RequestParam(value = "page", defaultValue = "1") Integer page,
            @RequestParam(value = "size", defaultValue = "10") Integer size
    ) {
        return chargingStationService.detailList(page, size);
    }
    @PostMapping
    public Result<?> add(@RequestBody ChargingStation chargingStation) {
        return chargingStationService.addData(chargingStation);
    }
    @PutMapping
    public Result<?> update(@RequestBody ChargingStation chargingStation) {
        return chargingStationService.updateData(chargingStation);
    }
    @DeleteMapping
    public Result<?> delete(@RequestParam String id) {
        return chargingStationService.deleteData(id);
    }
}
