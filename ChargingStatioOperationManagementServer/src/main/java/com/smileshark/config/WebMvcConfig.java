package com.smileshark.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.File;

/**
 * Web MVC 配置类
 * 用于配置静态资源访问
 */
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Value("${file-upload.path}")
    private String uploadPath;

    @Value("${file-upload.url-prefix}")
    private String urlPrefix;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 配置上传文件的访问路径
        String uploadPathPattern = urlPrefix + "**";

        // 确保路径以 / 结尾
        String physicalUploadPath = uploadPath;
        if (!physicalUploadPath.endsWith(File.separator)) {
            physicalUploadPath = physicalUploadPath + File.separator;
        }

        // 添加资源处理器
        registry.addResourceHandler(uploadPathPattern)
                .addResourceLocations("file:" + physicalUploadPath);
    }
}
