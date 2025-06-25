package com.smileshark.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.smileshark.common.Result;
import com.smileshark.entity.OperationsPersonnel;
import com.smileshark.service.OperationsPersonnelService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

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
    @GetMapping("/detailList")
    public Result<Page<OperationsPersonnel>> detailList(
            @RequestParam(value = "page",defaultValue = "1")Integer page,
            @RequestParam(value = "size",defaultValue = "10")Integer size,
            @RequestParam String param,
            @RequestParam(value = "state",required = false)Integer state
    ){
        return operationsPersonnelService.detailList(page, size, param, state);
    }
    @PostMapping
    public Result<?> add(@RequestBody OperationsPersonnel operationsPersonnel){
        return operationsPersonnelService.add(operationsPersonnel);
    }
    @PutMapping
    public Result<?> update(@RequestBody OperationsPersonnel operationsPersonnel){
        return operationsPersonnelService.update(operationsPersonnel);
    }
    @DeleteMapping()
    public Result<?> delete(@RequestParam String id){
        return operationsPersonnelService.delete(id);
    }
}
