package com.smileshark.controller;

import com.smileshark.common.Result;
import com.smileshark.entity.BillingRules;
import com.smileshark.service.BillingRulesService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

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
    public Result<List<BillingRules>> allList() {
        return billingRulesService.allList();
    }

    @GetMapping("/detailList")
    public Result<List<BillingRules>> detailList(
            @RequestParam String timeRange
    ) {
        String[] timeRangeArray = timeRange.split(",");
        List<Integer> timeRangeList = Arrays.stream(timeRangeArray)
                .map(Integer::parseInt)
                .toList();
        return billingRulesService.detailList(timeRangeList);
    }

    @PostMapping
    public Result<BillingRules> add(@RequestBody BillingRules billingRules) {
        return billingRulesService.add(billingRules);
    }
    @PutMapping
    public Result<?> update(@RequestBody BillingRules billingRules) {
        return billingRulesService.update(billingRules);
    }
    @DeleteMapping
    public Result<?> delete(@RequestParam String id) {
        return billingRulesService.delete(id);
    }

}
