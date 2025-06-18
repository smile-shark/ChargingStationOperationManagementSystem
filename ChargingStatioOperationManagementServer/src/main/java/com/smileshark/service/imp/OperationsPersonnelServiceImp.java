package com.smileshark.service.imp;

import com.smileshark.common.Result;
import com.smileshark.entity.OperationsPersonnel;
import com.smileshark.mapper.OperationsPersonnelMapper;
import com.smileshark.service.OperationsPersonnelService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * <p>
 * 杩愮淮浜哄憳 服务实现类
 * </p>
 *
 * @author smile鲨鱼
 * @since 2025年06月16日
 */
@Service
@RequiredArgsConstructor
public class OperationsPersonnelServiceImp extends ServiceImpl<OperationsPersonnelMapper, OperationsPersonnel> implements OperationsPersonnelService {

    @Override
    public Result<List<OperationsPersonnel>> simpleList() {
        return Result.ok(lambdaQuery()
                .select(
                        OperationsPersonnel::getOperationsPersonnelId,
                        OperationsPersonnel::getName
                ).list());
    }
}
