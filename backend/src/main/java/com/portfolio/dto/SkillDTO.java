package com.portfolio.dto;

import jakarta.validation.constraints.NotBlank;

public class SkillDTO {

    private Long id;

    @NotBlank(message = "Skill name is required")
    private String name;

    private String category;
    private Integer proficiency = 80;

    public SkillDTO() {
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

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Integer getProficiency() {
        return proficiency;
    }

    public void setProficiency(Integer proficiency) {
        this.proficiency = proficiency;
    }
}
