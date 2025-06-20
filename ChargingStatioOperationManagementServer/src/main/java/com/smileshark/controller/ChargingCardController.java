package com.smileshark.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.smileshark.common.Result;
import com.smileshark.entity.ChargingCard;
import com.smileshark.service.ChargingCardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

/**
 * <p>
 *  前端控制器
 * </p>
 *
 * @author smile鲨鱼
 * @since 2025年06月16日
 */
@RestController
@RequestMapping("/chargingCard")
@RequiredArgsConstructor
public class ChargingCardController {
    private final ChargingCardService chargingCardService;
    @GetMapping("/list")
    public Result<Page<ChargingCard>> list(
            @RequestParam(value = "page", defaultValue = "1") Integer page,
            @RequestParam(value = "size", defaultValue = "10") Integer size
    ){
        return chargingCardService.list(page, size);
    }
    @PostMapping
    public Result<?> add(@RequestBody ChargingCard chargingCard){
        return chargingCardService.add(chargingCard);
    }
    @PutMapping
    public Result<?> update(@RequestBody ChargingCard chargingCard){
        return chargingCardService.update(chargingCard);
    }
    @DeleteMapping
    public Result<?> delete(@RequestParam("id") String id){
        return chargingCardService.delete(id);
    }
}
