package com.smileshark;

import cn.hutool.core.util.IdUtil;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest(classes = Application.class)
@ActiveProfiles("test")
class ChargingStatioOperationManagementServerApplicationTests {

    @Test
    void contextLoads() {
        for (int i = 0; i < 10; i++) {
            System.out.println(IdUtil.simpleUUID());
        }
    }

}
