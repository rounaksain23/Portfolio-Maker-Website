package com.portfolio.dto;

public class TemplateDTO {

    private String key;
    private String name;
    private String description;
    private String category;
    private String previewImage;

    public TemplateDTO() {
    }

    public TemplateDTO(String key, String name, String description, String category, String previewImage) {
        this.key = key;
        this.name = name;
        this.description = description;
        this.category = category;
        this.previewImage = previewImage;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getPreviewImage() {
        return previewImage;
    }

    public void setPreviewImage(String previewImage) {
        this.previewImage = previewImage;
    }
}
