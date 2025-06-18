package com.smileshark.controller;

import com.smileshark.common.Result;
import com.smileshark.entity.OperationsPersonnel;
import com.smileshark.service.OperationsPersonnelService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * <p>
 * 杩愮淮浜哄憳 前端控制器
 * </p>
 *
 * @author smile鲨鱼
 * @since 2025年06月16日
 */
@RestController
@RequestMapping("/operationsPersonnel")
@RequiredArgsConstructor
public class OperationsPersonnelController {
    private final OperationsPersonnelService operationsPersonnelService;
    @GetMapping("/simpleList")
    public Result<List<OperationsPersonnel>> simpleList(){
        return operationsPersonnelService.simpleList();
    }
}
