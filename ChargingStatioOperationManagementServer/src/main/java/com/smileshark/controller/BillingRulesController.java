package com.smileshark.controller;

import com.smileshark.common.Result;
import com.smileshark.entity.BillingRules;
import com.smileshark.service.BillingRulesService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * <p>
 * 计费规则 前端控制器
 * </p>
 *
 * @author smile鲨鱼
 * @since 2025年06月16日
 */
@RestController
@RequestMapping("/billingRules")
@RequiredArgsConstructor
public class BillingRulesController {
    private final BillingRulesService billingRulesService;

    @GetMapping("/list")
    public Result<List<BillingRules>> allList(){
        return billingRulesService.allList();
    }

}
