package com.portfolio.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.portfolio.exception.BadRequestException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.Map;
import java.util.UUID;

@Service
public class FileStorageService {

    @Value("${upload.dir:uploads}")
    private String uploadDir;

    @Value("${cloudinary.cloud-name:}")
    private String cloudName;

    @Value("${cloudinary.api-key:}")
    private String apiKey;

    @Value("${cloudinary.api-secret:}")
    private String apiSecret;

    public String storeFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new BadRequestException("Failed to store empty file");
        }

        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename() != null ? file.getOriginalFilename() : "file");

        // Try Cloudinary if credentials provided
        if (StringUtils.hasText(cloudName) && StringUtils.hasText(apiKey) && StringUtils.hasText(apiSecret)) {
            try {
                Cloudinary cloudinary = new Cloudinary(ObjectUtils.asMap(
                        "cloud_name", cloudName,
                        "api_key", apiKey,
                        "api_secret", apiSecret
                ));
                Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
                return (String) uploadResult.get("secure_url");
            } catch (Exception ex) {
                System.err.println("Cloudinary upload failed, falling back to local storage: " + ex.getMessage());
            }
        }

        // Local storage fallback
        try {
            Path rootPath = Paths.get(uploadDir).toAbsolutePath().normalize();
            if (!Files.exists(rootPath)) {
                Files.createDirectories(rootPath);
            }

            String extension = "";
            int i = originalFilename.lastIndexOf('.');
            if (i > 0) {
                extension = originalFilename.substring(i);
            }

            String filename = UUID.randomUUID().toString() + extension;
            Path targetLocation = rootPath.resolve(filename);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            return "/uploads/" + filename;
        } catch (IOException ex) {
            throw new BadRequestException("Could not store file " + originalFilename + ". Please try again!");
        }
    }

    public String storeResume(MultipartFile file) {
        if (file.isEmpty()) {
            throw new BadRequestException("Failed to store empty file");
        }
        if (!"application/pdf".equals(file.getContentType())) {
            throw new BadRequestException("Resume must be a PDF file");
        }
        if (file.getSize() > 5 * 1024 * 1024) { // 5MB cap
            throw new BadRequestException("Resume must be under 5MB");
        }

        if (StringUtils.hasText(cloudName) && StringUtils.hasText(apiKey) && StringUtils.hasText(apiSecret)) {
            try {
                Cloudinary cloudinary = new Cloudinary(ObjectUtils.asMap(
                        "cloud_name", cloudName, "api_key", apiKey, "api_secret", apiSecret));
                String publicId = "resumes/resume_" + System.currentTimeMillis();
                Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(),
                        ObjectUtils.asMap(
                                "resource_type", "raw",
                                "public_id", publicId,
                                "format", "pdf"
                        ));
                return (String) uploadResult.get("secure_url");
            } catch (Exception ex) {
                System.err.println("Cloudinary resume upload failed, falling back to local storage: " + ex.getMessage());
            }
        }

        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename() != null ? file.getOriginalFilename() : "resume.pdf");

        try {
            Path rootPath = Paths.get(uploadDir).toAbsolutePath().normalize();
            if (!Files.exists(rootPath)) {
                Files.createDirectories(rootPath);
            }

            String extension = "";
            int i = originalFilename.lastIndexOf('.');
            if (i > 0) {
                extension = originalFilename.substring(i);
            }

            String filename = UUID.randomUUID().toString() + extension;
            Path targetLocation = rootPath.resolve(filename);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            return "/uploads/" + filename;
        } catch (IOException ex) {
            throw new BadRequestException("Could not store file " + originalFilename + ". Please try again!");
        }
    }
}
