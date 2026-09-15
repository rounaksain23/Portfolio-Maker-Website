package com.portfolio.dto;

import jakarta.validation.constraints.NotBlank;

public class ProjectDTO {

    private Long id;

    @NotBlank(message = "Project title is required")
    private String title;

    private String description;
    private String techStack;
    private String imageUrl;
    private java.util.List<String> imageUrls = new java.util.ArrayList<>();
    private String githubLink;
    private String liveLink;
    private String highlightStat1;
    private String highlightStat2;
    private Integer displayOrder = 0;

    public ProjectDTO() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getTechStack() {
        return techStack;
    }

    public void setTechStack(String techStack) {
        this.techStack = techStack;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public java.util.List<String> getImageUrls() {
        return imageUrls;
    }

    public void setImageUrls(java.util.List<String> imageUrls) {
        this.imageUrls = imageUrls;
    }

    public String getGithubLink() {
        return githubLink;
    }

    public void setGithubLink(String githubLink) {
        this.githubLink = githubLink;
    }

    public String getLiveLink() {
        return liveLink;
    }

    public void setLiveLink(String liveLink) {
        this.liveLink = liveLink;
    }

    public String getHighlightStat1() {
        return highlightStat1;
    }

    public void setHighlightStat1(String highlightStat1) {
        this.highlightStat1 = highlightStat1;
    }

    public String getHighlightStat2() {
        return highlightStat2;
    }

    public void setHighlightStat2(String highlightStat2) {
        this.highlightStat2 = highlightStat2;
    }

    public Integer getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }
}
