package com.smileshark.service.imp;

import com.smileshark.entity.Task;
import com.smileshark.mapper.TaskMapper;
import com.smileshark.service.TaskService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

/**
 * <p>
 * 浠诲姟 服务实现类
 * </p>
 *
 * @author smile鲨鱼
 * @since 2025年06月16日
 */
@Service
public class TaskServiceImp extends ServiceImpl<TaskMapper, Task> implements TaskService {

}
