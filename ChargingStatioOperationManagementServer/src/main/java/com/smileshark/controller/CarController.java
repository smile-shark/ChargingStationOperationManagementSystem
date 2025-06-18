package com.smileshark.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.smileshark.common.Result;
import com.smileshark.entity.Car;
import com.smileshark.service.CarService;
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
@RequestMapping("/car")
@RequiredArgsConstructor
public class CarController {
    private final CarService carService;

    @GetMapping
    public Result<Page<Car>> list(
            @RequestParam(value = "page", defaultValue = "1") Integer page,
            @RequestParam(value = "size", defaultValue = "10") Integer size,
            @RequestParam(value = "param") String param
    ){
        return carService.list(page,size,param);
    }
    @PostMapping
    public Result<?> add(@RequestBody Car car){
        return carService.add(car);
    }
    @PutMapping
    public Result<?> update(@RequestBody Car car){
        return carService.update(car);
    }
    @DeleteMapping
    public Result<?> delete(@RequestParam("id") String id){
        return carService.delete(id );
    }
}
