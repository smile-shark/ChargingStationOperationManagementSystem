package com.smileshark.controller;

import com.smileshark.common.Result;
import com.smileshark.service.CarMService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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
@RequestMapping("/carM")
@RequiredArgsConstructor
public class CarMController {
    private final CarMService carMService;
    @GetMapping("/userIdListByCarId")
    public Result<List<String>> getUserIdList(@RequestParam("carId") String carId) {
        return carMService.getUserIdList(carId);
    }
}
