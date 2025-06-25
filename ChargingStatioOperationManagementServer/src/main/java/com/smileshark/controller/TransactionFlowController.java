package com.smileshark.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.smileshark.common.Result;
import com.smileshark.entity.TransactionFlow;
import com.smileshark.service.TransactionFlowService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * <p>
 *  前端控制器
 * </p>
 *
 * @author smile鲨鱼
 * @since 2025年06月16日
 */
@RestController
@RequestMapping("/transactionFlow")
@RequiredArgsConstructor
public class TransactionFlowController {
    private final TransactionFlowService transactionFlowService;
    @GetMapping("/detailList")
    public Result<Page<TransactionFlow>> detailList(
            @RequestParam(value = "page", defaultValue = "1") Integer page,
            @RequestParam(value = "size", defaultValue = "10") Integer size,
            @RequestParam(value = "param",defaultValue = "") String param
    ){
        return transactionFlowService.detailList(page, size, param);
    }
}
