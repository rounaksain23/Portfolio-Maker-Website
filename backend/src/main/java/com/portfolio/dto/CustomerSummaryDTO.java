package com.portfolio.dto;

import com.portfolio.model.UserStatus;
import java.time.LocalDateTime;

public class CustomerSummaryDTO {

    private Long id;
    private String name;
    private String email;
    private UserStatus status;
    private LocalDateTime createdAt;
    private boolean portfolioCreated;
    private boolean published;
    private String slug;
    private String activeInviteToken;
    private String setupUrl;

    public CustomerSummaryDTO() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public UserStatus getStatus() {
        return status;
    }

    public void setStatus(UserStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public boolean isPortfolioCreated() {
        return portfolioCreated;
    }

    public void setPortfolioCreated(boolean portfolioCreated) {
        this.portfolioCreated = portfolioCreated;
    }

    public boolean isPublished() {
        return published;
    }

    public void setPublished(boolean published) {
        this.published = published;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public String getActiveInviteToken() {
        return activeInviteToken;
    }

    public void setActiveInviteToken(String activeInviteToken) {
        this.activeInviteToken = activeInviteToken;
    }

    public String getSetupUrl() {
        return setupUrl;
    }

    public void setSetupUrl(String setupUrl) {
        this.setupUrl = setupUrl;
    }
}
