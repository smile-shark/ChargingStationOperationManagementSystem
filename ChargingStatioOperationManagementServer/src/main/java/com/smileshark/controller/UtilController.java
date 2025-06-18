package com.smileshark.controller;

import com.smileshark.common.Result;
import com.smileshark.common.code.ResultCode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@RestController
@RequestMapping("/util")
public class UtilController {

    @Value("${file-upload.path}")
    private String uploadPath;

    @Value("${file-upload.url-prefix}")
    private String urlPrefix;

    @PostMapping("/uploadImage")
    public Result<String> uploadImage(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return Result.no(ResultCode.ERROR);
        }

        try {
            // 确保上传目录存在
            File uploadDir = new File(uploadPath);
            if (!uploadDir.exists()) {
                uploadDir.mkdirs();
            }

            // 获取文件名和扩展名
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));

            // 生成新的文件名，避免文件名冲突
            String newFilename = UUID.randomUUID().toString() + extension;

            // 保存文件
            Path filePath = Paths.get(uploadPath, newFilename);
            Files.write(filePath, file.getBytes());

            // 返回可访问的URI
            String fileUri = urlPrefix + newFilename;

            return Result.ok(fileUri);
        } catch (IOException e) {
            e.printStackTrace();
            return Result.no(ResultCode.FAILED);
        }
    }
}
