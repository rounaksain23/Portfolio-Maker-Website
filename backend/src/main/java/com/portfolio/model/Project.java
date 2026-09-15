package com.portfolio.model;

import jakarta.persistence.*;

@Entity
@Table(name = "projects")
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "portfolio_id", nullable = false)
    private Portfolio portfolio;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "tech_stack")
    private String techStack;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "image_urls", columnDefinition = "TEXT")
    private String imageUrls; // JSON string or comma-separated list of image URLs

    @Column(name = "github_link")
    private String githubLink;

    @Column(name = "live_link")
    private String liveLink;

    @Column(name = "highlight_stat_1")
    private String highlightStat1;

    @Column(name = "highlight_stat_2")
    private String highlightStat2;

    @Column(name = "display_order")
    private Integer displayOrder = 0;

    public Project() {
    }

    public Project(Portfolio portfolio, String title, String description, String techStack, String imageUrl, String githubLink, String liveLink, Integer displayOrder) {
        this.portfolio = portfolio;
        this.title = title;
        this.description = description;
        this.techStack = techStack;
        this.imageUrl = imageUrl;
        this.githubLink = githubLink;
        this.liveLink = liveLink;
        this.displayOrder = displayOrder != null ? displayOrder : 0;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Portfolio getPortfolio() {
        return portfolio;
    }

    public void setPortfolio(Portfolio portfolio) {
        this.portfolio = portfolio;
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

    public String getImageUrls() {
        return imageUrls;
    }

    public void setImageUrls(String imageUrls) {
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

    public Integer getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
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
}
