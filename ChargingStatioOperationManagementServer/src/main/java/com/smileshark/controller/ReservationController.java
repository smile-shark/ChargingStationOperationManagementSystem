package com.smileshark.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.smileshark.common.Result;
import com.smileshark.entity.Reservation;
import com.smileshark.service.ReservationService;
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
@RequestMapping("/reservation")
@RequiredArgsConstructor
public class ReservationController {
    private final ReservationService reservationService;
    @GetMapping("/list")
    public Result<Page<Reservation>> detailList(
            @RequestParam(required = false, defaultValue = "1") Integer page,
            @RequestParam(required = false, defaultValue = "10") Integer size,
            @RequestParam(required = false) String param
    ){
        return reservationService.detailList(page,size,param);
    }
    @PostMapping
    public Result<?> add(@RequestBody Reservation reservation){
        return reservationService.add(reservation);
    }
    @PutMapping
    public Result<?> update(@RequestBody Reservation reservation){
        return reservationService.update(reservation);
    }
    @DeleteMapping
    private Result<?> delete(@RequestParam("id") String id){
        return reservationService.delete(id);
    }
}
