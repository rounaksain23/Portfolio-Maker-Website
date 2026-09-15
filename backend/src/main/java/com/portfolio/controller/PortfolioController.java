package com.portfolio.controller;

import com.portfolio.dto.*;
import com.portfolio.security.UserPrincipal;
import com.portfolio.service.PortfolioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/api/portfolio")
@PreAuthorize("hasRole('CUSTOMER')")
public class PortfolioController {

    @Autowired
    private PortfolioService portfolioService;

    @GetMapping("/me")
    public ResponseEntity<PortfolioDTO> getMyPortfolio(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        PortfolioDTO dto = portfolioService.getPortfolioByUserId(userPrincipal.getId());
        return ResponseEntity.ok(dto);
    }

    @PutMapping("/me")
    public ResponseEntity<PortfolioDTO> updatePersonalDetails(@AuthenticationPrincipal UserPrincipal userPrincipal,
                                                              @RequestBody PortfolioDTO dto) {
        PortfolioDTO updated = portfolioService.updatePersonalDetails(userPrincipal.getId(), dto);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/publish")
    public ResponseEntity<PortfolioDTO> togglePublish(@AuthenticationPrincipal UserPrincipal userPrincipal,
                                                      @RequestBody(required = false) Map<String, Boolean> body) {
        Boolean published = body != null ? body.get("published") : null;
        PortfolioDTO updated = portfolioService.togglePublish(userPrincipal.getId(), published);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/template")
    public ResponseEntity<PortfolioDTO> setTemplate(@AuthenticationPrincipal UserPrincipal userPrincipal,
                                                    @RequestBody Map<String, String> body) {
        String templateKey = body.get("templateKey");
        PortfolioDTO updated = portfolioService.setTemplateKey(userPrincipal.getId(), templateKey);
        return ResponseEntity.ok(updated);
    }

    // Project Endpoints
    @PostMapping("/projects")
    public ResponseEntity<ProjectDTO> addProject(@AuthenticationPrincipal UserPrincipal userPrincipal,
                                                 @Valid @RequestBody ProjectDTO dto) {
        ProjectDTO created = portfolioService.addProject(userPrincipal.getId(), dto);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/projects/{id}")
    public ResponseEntity<ProjectDTO> updateProject(@AuthenticationPrincipal UserPrincipal userPrincipal,
                                                    @PathVariable("id") Long projectId,
                                                    @Valid @RequestBody ProjectDTO dto) {
        ProjectDTO updated = portfolioService.updateProject(userPrincipal.getId(), projectId, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/projects/{id}")
    public ResponseEntity<Map<String, Boolean>> deleteProject(@AuthenticationPrincipal UserPrincipal userPrincipal,
                                                             @PathVariable("id") Long projectId) {
        portfolioService.deleteProject(userPrincipal.getId(), projectId);
        return ResponseEntity.ok(Collections.singletonMap("success", true));
    }

    // Skill Endpoints
    @PostMapping("/skills")
    public ResponseEntity<SkillDTO> addSkill(@AuthenticationPrincipal UserPrincipal userPrincipal,
                                             @Valid @RequestBody SkillDTO dto) {
        SkillDTO created = portfolioService.addSkill(userPrincipal.getId(), dto);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/skills/{id}")
    public ResponseEntity<SkillDTO> updateSkill(@AuthenticationPrincipal UserPrincipal userPrincipal,
                                                @PathVariable("id") Long skillId,
                                                @Valid @RequestBody SkillDTO dto) {
        SkillDTO updated = portfolioService.updateSkill(userPrincipal.getId(), skillId, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/skills/{id}")
    public ResponseEntity<Map<String, Boolean>> deleteSkill(@AuthenticationPrincipal UserPrincipal userPrincipal,
                                                           @PathVariable("id") Long skillId) {
        portfolioService.deleteSkill(userPrincipal.getId(), skillId);
        return ResponseEntity.ok(Collections.singletonMap("success", true));
    }

    // Education Endpoints
    @PostMapping("/education")
    public ResponseEntity<EducationDTO> addEducation(@AuthenticationPrincipal UserPrincipal userPrincipal,
                                                     @Valid @RequestBody EducationDTO dto) {
        EducationDTO created = portfolioService.addEducation(userPrincipal.getId(), dto);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/education/{id}")
    public ResponseEntity<EducationDTO> updateEducation(@AuthenticationPrincipal UserPrincipal userPrincipal,
                                                        @PathVariable("id") Long educationId,
                                                        @Valid @RequestBody EducationDTO dto) {
        EducationDTO updated = portfolioService.updateEducation(userPrincipal.getId(), educationId, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/education/{id}")
    public ResponseEntity<Map<String, Boolean>> deleteEducation(@AuthenticationPrincipal UserPrincipal userPrincipal,
                                                               @PathVariable("id") Long educationId) {
        portfolioService.deleteEducation(userPrincipal.getId(), educationId);
        return ResponseEntity.ok(Collections.singletonMap("success", true));
    }

    // Experience Endpoints
    @PostMapping("/experience")
    public ResponseEntity<ExperienceDTO> addExperience(@AuthenticationPrincipal UserPrincipal userPrincipal,
                                                       @Valid @RequestBody ExperienceDTO dto) {
        ExperienceDTO created = portfolioService.addExperience(userPrincipal.getId(), dto);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/experience/{id}")
    public ResponseEntity<ExperienceDTO> updateExperience(@AuthenticationPrincipal UserPrincipal userPrincipal,
                                                          @PathVariable("id") Long experienceId,
                                                          @Valid @RequestBody ExperienceDTO dto) {
        ExperienceDTO updated = portfolioService.updateExperience(userPrincipal.getId(), experienceId, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/experience/{id}")
    public ResponseEntity<Map<String, Boolean>> deleteExperience(@AuthenticationPrincipal UserPrincipal userPrincipal,
                                                                 @PathVariable("id") Long experienceId) {
        portfolioService.deleteExperience(userPrincipal.getId(), experienceId);
        return ResponseEntity.ok(Collections.singletonMap("success", true));
    }

    // Achievements Endpoints
    @PostMapping("/achievements")
    public ResponseEntity<AchievementDTO> addAchievement(@AuthenticationPrincipal UserPrincipal userPrincipal,
                                                         @Valid @RequestBody AchievementDTO dto) {
        AchievementDTO created = portfolioService.addAchievement(userPrincipal.getId(), dto);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/achievements/{id}")
    public ResponseEntity<AchievementDTO> updateAchievement(@AuthenticationPrincipal UserPrincipal userPrincipal,
                                                            @PathVariable("id") Long achievementId,
                                                            @Valid @RequestBody AchievementDTO dto) {
        AchievementDTO updated = portfolioService.updateAchievement(userPrincipal.getId(), achievementId, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/achievements/{id}")
    public ResponseEntity<Map<String, Boolean>> deleteAchievement(@AuthenticationPrincipal UserPrincipal userPrincipal,
                                                               @PathVariable("id") Long achievementId) {
        portfolioService.deleteAchievement(userPrincipal.getId(), achievementId);
        return ResponseEntity.ok(Collections.singletonMap("success", true));
    }

    // Resume Endpoints
    @PostMapping("/resume")
    public ResponseEntity<Map<String, String>> uploadResume(@AuthenticationPrincipal UserPrincipal userPrincipal,
                                                           @RequestParam("file") MultipartFile file) {
        String resumeUrl = portfolioService.uploadResume(userPrincipal.getId(), file);
        return ResponseEntity.ok(Collections.singletonMap("resumeUrl", resumeUrl));
    }

    @DeleteMapping("/resume")
    public ResponseEntity<Map<String, Boolean>> deleteResume(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        portfolioService.deleteResume(userPrincipal.getId());
        return ResponseEntity.ok(Collections.singletonMap("success", true));
    }
}
