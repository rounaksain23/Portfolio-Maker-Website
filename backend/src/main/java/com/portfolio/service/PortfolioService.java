package com.portfolio.service;

import com.portfolio.dto.*;
import com.portfolio.exception.BadRequestException;
import com.portfolio.exception.ResourceNotFoundException;
import com.portfolio.model.*;
import com.portfolio.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PortfolioService {

    @Autowired
    private PortfolioRepository portfolioRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private SkillRepository skillRepository;

    @Autowired
    private EducationRepository educationRepository;

    @Autowired
    private ExperienceRepository experienceRepository;

    @Autowired
    private AchievementRepository achievementRepository;

    @Autowired
    private FileStorageService fileStorageService;

    public PortfolioDTO getPortfolioByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Portfolio portfolio = portfolioRepository.findByUser(user)
                .orElseGet(() -> {
                    String baseSlug = "user-" + userId;
                    Portfolio newP = new Portfolio(user, baseSlug);
                    return portfolioRepository.save(newP);
                });

        return mapToDTO(portfolio);
    }

    public PortfolioDTO getPublicPortfolioBySlug(String slug) {
        Portfolio portfolio = portfolioRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio not found with slug: " + slug));

        if (!portfolio.isPublished()) {
            throw new BadRequestException("This portfolio is currently private / unpublished");
        }

        if (portfolio.getUser().getStatus() == UserStatus.DISABLED) {
            throw new BadRequestException("This user account is currently disabled");
        }

        return mapToDTO(portfolio);
    }

    @Transactional
    public PortfolioDTO updatePersonalDetails(Long userId, PortfolioDTO dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Portfolio portfolio = portfolioRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio not found for user"));

        if (dto.getName() != null && !dto.getName().isBlank()) {
            user.setName(dto.getName());
            userRepository.save(user);
        }

        if (dto.getSlug() != null && !dto.getSlug().isBlank() && !dto.getSlug().equals(portfolio.getSlug())) {
            String newSlug = dto.getSlug().toLowerCase().replaceAll("[^a-z0-9-]", "-").replaceAll("-+", "-").replaceAll("^-|-$", "");
            if (portfolioRepository.existsBySlug(newSlug)) {
                throw new BadRequestException("Slug '" + newSlug + "' is already taken by another user");
            }
            portfolio.setSlug(newSlug);
        }

        portfolio.setTitle(dto.getTitle());
        portfolio.setTagline(dto.getTagline());
        portfolio.setBio(dto.getBio());
        portfolio.setProfileImageUrl(dto.getProfileImageUrl());
        portfolio.setPhone(dto.getPhone());
        portfolio.setLocation(dto.getLocation());
        portfolio.setSocialLinks(dto.getSocialLinks());
        portfolio.setUpdatedAt(LocalDateTime.now());

        portfolioRepository.save(portfolio);
        return mapToDTO(portfolio);
    }

    public PortfolioDTO setTemplateKey(Long userId, String templateKey) {
        Portfolio portfolio = getPortfolioEntityByUserId(userId);
        portfolio.setTemplateKey(templateKey);
        portfolio.setUpdatedAt(LocalDateTime.now());
        portfolioRepository.save(portfolio);
        return mapToDTO(portfolio);
    }

    public PortfolioDTO togglePublish(Long userId, Boolean publishState) {
        Portfolio portfolio = getPortfolioEntityByUserId(userId);
        boolean newState = publishState != null ? publishState : !portfolio.isPublished();
        portfolio.setPublished(newState);
        portfolio.setUpdatedAt(LocalDateTime.now());
        portfolioRepository.save(portfolio);
        return mapToDTO(portfolio);
    }

    // Projects CRUD
    public ProjectDTO addProject(Long userId, ProjectDTO dto) {
        Portfolio portfolio = getPortfolioEntityByUserId(userId);
        Project project = new Project(
                portfolio,
                dto.getTitle(),
                dto.getDescription(),
                dto.getTechStack(),
                dto.getImageUrl(),
                dto.getGithubLink(),
                dto.getLiveLink(),
                dto.getDisplayOrder()
        );
        if (dto.getImageUrls() != null && !dto.getImageUrls().isEmpty()) {
            project.setImageUrls(String.join(",", dto.getImageUrls()));
            if (project.getImageUrl() == null || project.getImageUrl().isBlank()) {
                project.setImageUrl(dto.getImageUrls().get(0));
            }
        }
        project.setHighlightStat1(dto.getHighlightStat1());
        project.setHighlightStat2(dto.getHighlightStat2());
        project = projectRepository.save(project);
        return mapProjectToDTO(project);
    }

    public ProjectDTO updateProject(Long userId, Long projectId, ProjectDTO dto) {
        Portfolio portfolio = getPortfolioEntityByUserId(userId);
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        if (!project.getPortfolio().getId().equals(portfolio.getId())) {
            throw new BadRequestException("Unauthorized to modify this project");
        }

        project.setTitle(dto.getTitle());
        project.setDescription(dto.getDescription());
        project.setTechStack(dto.getTechStack());
        project.setImageUrl(dto.getImageUrl());
        project.setGithubLink(dto.getGithubLink());
        project.setLiveLink(dto.getLiveLink());
        project.setHighlightStat1(dto.getHighlightStat1());
        project.setHighlightStat2(dto.getHighlightStat2());
        if (dto.getDisplayOrder() != null) {
            project.setDisplayOrder(dto.getDisplayOrder());
        }
        if (dto.getImageUrls() != null && !dto.getImageUrls().isEmpty()) {
            project.setImageUrls(String.join(",", dto.getImageUrls()));
            if (project.getImageUrl() == null || project.getImageUrl().isBlank()) {
                project.setImageUrl(dto.getImageUrls().get(0));
            }
        } else if (dto.getImageUrls() != null && dto.getImageUrls().isEmpty()) {
            project.setImageUrls("");
        }

        project = projectRepository.save(project);
        return mapProjectToDTO(project);
    }

    public void deleteProject(Long userId, Long projectId) {
        Portfolio portfolio = getPortfolioEntityByUserId(userId);
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        if (!project.getPortfolio().getId().equals(portfolio.getId())) {
            throw new BadRequestException("Unauthorized to delete this project");
        }

        projectRepository.delete(project);
    }

    // Skills CRUD
    public SkillDTO addSkill(Long userId, SkillDTO dto) {
        Portfolio portfolio = getPortfolioEntityByUserId(userId);
        Skill skill = new Skill(portfolio, dto.getName(), dto.getCategory(), dto.getProficiency());
        skill = skillRepository.save(skill);
        return mapSkillToDTO(skill);
    }

    public SkillDTO updateSkill(Long userId, Long skillId, SkillDTO dto) {
        Portfolio portfolio = getPortfolioEntityByUserId(userId);
        Skill skill = skillRepository.findById(skillId)
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found"));

        if (!skill.getPortfolio().getId().equals(portfolio.getId())) {
            throw new BadRequestException("Unauthorized to modify this skill");
        }

        skill.setName(dto.getName());
        skill.setCategory(dto.getCategory());
        if (dto.getProficiency() != null) {
            skill.setProficiency(dto.getProficiency());
        }

        skill = skillRepository.save(skill);
        return mapSkillToDTO(skill);
    }

    public void deleteSkill(Long userId, Long skillId) {
        Portfolio portfolio = getPortfolioEntityByUserId(userId);
        Skill skill = skillRepository.findById(skillId)
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found"));

        if (!skill.getPortfolio().getId().equals(portfolio.getId())) {
            throw new BadRequestException("Unauthorized to delete this skill");
        }

        skillRepository.delete(skill);
    }

    // Education CRUD
    public EducationDTO addEducation(Long userId, EducationDTO dto) {
        Portfolio portfolio = getPortfolioEntityByUserId(userId);
        Education education = new Education(portfolio, dto.getInstitution(), dto.getDegree(), dto.getFieldOfStudy(), dto.getStartDate(), dto.getEndDate(), dto.getDescription());
        education = educationRepository.save(education);
        return mapEducationToDTO(education);
    }

    public EducationDTO updateEducation(Long userId, Long educationId, EducationDTO dto) {
        Portfolio portfolio = getPortfolioEntityByUserId(userId);
        Education education = educationRepository.findById(educationId)
                .orElseThrow(() -> new ResourceNotFoundException("Education entry not found"));

        if (!education.getPortfolio().getId().equals(portfolio.getId())) {
            throw new BadRequestException("Unauthorized to modify this education entry");
        }

        education.setInstitution(dto.getInstitution());
        education.setDegree(dto.getDegree());
        education.setFieldOfStudy(dto.getFieldOfStudy());
        education.setStartDate(dto.getStartDate());
        education.setEndDate(dto.getEndDate());
        education.setDescription(dto.getDescription());

        education = educationRepository.save(education);
        return mapEducationToDTO(education);
    }

    public void deleteEducation(Long userId, Long educationId) {
        Portfolio portfolio = getPortfolioEntityByUserId(userId);
        Education education = educationRepository.findById(educationId)
                .orElseThrow(() -> new ResourceNotFoundException("Education entry not found"));

        if (!education.getPortfolio().getId().equals(portfolio.getId())) {
            throw new BadRequestException("Unauthorized to delete this education entry");
        }

        educationRepository.delete(education);
    }

    // Experience CRUD
    public ExperienceDTO addExperience(Long userId, ExperienceDTO dto) {
        Portfolio portfolio = getPortfolioEntityByUserId(userId);
        Experience experience = new Experience(portfolio, dto.getCompany(), dto.getPosition(), dto.getLocation(), dto.getStartDate(), dto.getEndDate(), dto.isCurrent(), dto.getDescription());
        experience = experienceRepository.save(experience);
        return mapExperienceToDTO(experience);
    }

    public ExperienceDTO updateExperience(Long userId, Long experienceId, ExperienceDTO dto) {
        Portfolio portfolio = getPortfolioEntityByUserId(userId);
        Experience experience = experienceRepository.findById(experienceId)
                .orElseThrow(() -> new ResourceNotFoundException("Experience entry not found"));

        if (!experience.getPortfolio().getId().equals(portfolio.getId())) {
            throw new BadRequestException("Unauthorized to modify this experience entry");
        }

        experience.setCompany(dto.getCompany());
        experience.setPosition(dto.getPosition());
        experience.setLocation(dto.getLocation());
        experience.setStartDate(dto.getStartDate());
        experience.setEndDate(dto.getEndDate());
        experience.setCurrent(dto.isCurrent());
        experience.setDescription(dto.getDescription());

        experience = experienceRepository.save(experience);
        return mapExperienceToDTO(experience);
    }

    public void deleteExperience(Long userId, Long experienceId) {
        Portfolio portfolio = getPortfolioEntityByUserId(userId);
        Experience experience = experienceRepository.findById(experienceId)
                .orElseThrow(() -> new ResourceNotFoundException("Experience entry not found"));

        if (!experience.getPortfolio().getId().equals(portfolio.getId())) {
            throw new BadRequestException("Unauthorized to delete this experience entry");
        }

        experienceRepository.delete(experience);
    }

    // Achievements CRUD
    public AchievementDTO addAchievement(Long userId, AchievementDTO dto) {
        Portfolio portfolio = getPortfolioEntityByUserId(userId);
        Achievement achievement = new Achievement(portfolio, dto.getTitle(), dto.getOrganization(), dto.getDuration(), dto.getDescription());
        achievement = achievementRepository.save(achievement);
        return mapAchievementToDTO(achievement);
    }

    public AchievementDTO updateAchievement(Long userId, Long achievementId, AchievementDTO dto) {
        Portfolio portfolio = getPortfolioEntityByUserId(userId);
        Achievement achievement = achievementRepository.findById(achievementId)
                .orElseThrow(() -> new ResourceNotFoundException("Achievement not found"));

        if (!achievement.getPortfolio().getId().equals(portfolio.getId())) {
            throw new BadRequestException("Unauthorized to modify this achievement");
        }

        achievement.setTitle(dto.getTitle());
        achievement.setOrganization(dto.getOrganization());
        achievement.setDuration(dto.getDuration());
        achievement.setDescription(dto.getDescription());

        achievement = achievementRepository.save(achievement);
        return mapAchievementToDTO(achievement);
    }

    public void deleteAchievement(Long userId, Long achievementId) {
        Portfolio portfolio = getPortfolioEntityByUserId(userId);
        Achievement achievement = achievementRepository.findById(achievementId)
                .orElseThrow(() -> new ResourceNotFoundException("Achievement not found"));

        if (!achievement.getPortfolio().getId().equals(portfolio.getId())) {
            throw new BadRequestException("Unauthorized to delete this achievement");
        }

        achievementRepository.delete(achievement);
    }

    @Transactional
    public String uploadResume(Long userId, MultipartFile file) {
        Portfolio portfolio = getPortfolioEntityByUserId(userId);
        String resumeUrl = fileStorageService.storeResume(file);
        portfolio.setResumeUrl(resumeUrl);
        portfolio.setUpdatedAt(LocalDateTime.now());
        portfolioRepository.save(portfolio);
        return resumeUrl;
    }

    @Transactional
    public void deleteResume(Long userId) {
        Portfolio portfolio = getPortfolioEntityByUserId(userId);
        portfolio.setResumeUrl(null);
        portfolio.setUpdatedAt(LocalDateTime.now());
        portfolioRepository.save(portfolio);
    }

    public List<TemplateDTO> getAvailableTemplates() {
        List<TemplateDTO> templates = new ArrayList<>();
        templates.add(new TemplateDTO("minimal", "Minimal Clean", "Sophisticated minimalist theme focusing on typography, whitespace, and subtle border accents.", "Minimalist", "/templates/minimal.png"));
        templates.add(new TemplateDTO("modern-dark", "Modern Dark Cyber", "Sleek dark theme with neon cyan gradients, glassmorphism cards, and interactive glow.", "Dark Theme", "/templates/modern-dark.png"));
        templates.add(new TemplateDTO("creative", "Creative Vibrant", "Dynamic gradient hero, colorful tag badges, and smooth playful animations for designers & creators.", "Creative", "/templates/creative.png"));
        templates.add(new TemplateDTO("classic", "Classic Executive Resume", "Professional dual-column layout tailored for engineers, managers, and consultants.", "Professional", "/templates/classic.png"));
        templates.add(new TemplateDTO("aman-dev", "Aman Dev / Cyber Pink", "Minimalist dark aesthetic inspired by aman-dev with elegant serif typography and pink-purple gradients.", "Cyberpunk", "/templates/aman-dev.png"));
        templates.add(new TemplateDTO("personal-brand", "Personal Brand", "Punchy personal-brand story theme with categorized skill tabs, stats highlights, and achievements timeline.", "Personal Brand", "/templates/personal-brand.png"));
        return templates;
    }

    private Portfolio getPortfolioEntityByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return portfolioRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio not found for user"));
    }

    private PortfolioDTO mapToDTO(Portfolio portfolio) {
        PortfolioDTO dto = new PortfolioDTO();
        dto.setId(portfolio.getId());
        dto.setUserId(portfolio.getUser().getId());
        dto.setName(portfolio.getUser().getName());
        dto.setEmail(portfolio.getUser().getEmail());
        dto.setSlug(portfolio.getSlug());
        dto.setTitle(portfolio.getTitle());
        dto.setTagline(portfolio.getTagline());
        dto.setBio(portfolio.getBio());
        dto.setProfileImageUrl(portfolio.getProfileImageUrl());
        dto.setResumeUrl(portfolio.getResumeUrl());
        dto.setPhone(portfolio.getPhone());
        dto.setLocation(portfolio.getLocation());
        dto.setSocialLinks(portfolio.getSocialLinks());
        dto.setPublished(portfolio.isPublished());
        dto.setTemplateKey(portfolio.getTemplateKey());
        dto.setUpdatedAt(portfolio.getUpdatedAt());

        dto.setProjects(projectRepository.findByPortfolioIdOrderByDisplayOrderAscIdAsc(portfolio.getId())
                .stream().map(this::mapProjectToDTO).collect(Collectors.toList()));
        dto.setSkills(skillRepository.findByPortfolioId(portfolio.getId())
                .stream().map(this::mapSkillToDTO).collect(Collectors.toList()));
        dto.setEducationList(educationRepository.findByPortfolioId(portfolio.getId())
                .stream().map(this::mapEducationToDTO).collect(Collectors.toList()));
        dto.setExperienceList(experienceRepository.findByPortfolioId(portfolio.getId())
                .stream().map(this::mapExperienceToDTO).collect(Collectors.toList()));
        dto.setAchievements(achievementRepository.findByPortfolioId(portfolio.getId())
                .stream().map(this::mapAchievementToDTO).collect(Collectors.toList()));

        return dto;
    }

    private ProjectDTO mapProjectToDTO(Project project) {
        ProjectDTO dto = new ProjectDTO();
        dto.setId(project.getId());
        dto.setTitle(project.getTitle());
        dto.setDescription(project.getDescription());
        dto.setTechStack(project.getTechStack());
        dto.setImageUrl(project.getImageUrl());
        dto.setGithubLink(project.getGithubLink());
        dto.setLiveLink(project.getLiveLink());
        dto.setHighlightStat1(project.getHighlightStat1());
        dto.setHighlightStat2(project.getHighlightStat2());
        dto.setDisplayOrder(project.getDisplayOrder());

        List<String> list = new ArrayList<>();
        if (project.getImageUrls() != null && !project.getImageUrls().isBlank()) {
            String[] split = project.getImageUrls().split(",");
            for (String s : split) {
                if (!s.isBlank()) {
                    list.add(s.trim());
                }
            }
        }
        if (list.isEmpty() && project.getImageUrl() != null && !project.getImageUrl().isBlank()) {
            list.add(project.getImageUrl());
        }
        dto.setImageUrls(list);
        if ((dto.getImageUrl() == null || dto.getImageUrl().isBlank()) && !list.isEmpty()) {
            dto.setImageUrl(list.get(0));
        }

        return dto;
    }

    private SkillDTO mapSkillToDTO(Skill skill) {
        SkillDTO dto = new SkillDTO();
        dto.setId(skill.getId());
        dto.setName(skill.getName());
        dto.setCategory(skill.getCategory());
        dto.setProficiency(skill.getProficiency());
        return dto;
    }

    private EducationDTO mapEducationToDTO(Education education) {
        EducationDTO dto = new EducationDTO();
        dto.setId(education.getId());
        dto.setInstitution(education.getInstitution());
        dto.setDegree(education.getDegree());
        dto.setFieldOfStudy(education.getFieldOfStudy());
        dto.setStartDate(education.getStartDate());
        dto.setEndDate(education.getEndDate());
        dto.setDescription(education.getDescription());
        return dto;
    }

    private ExperienceDTO mapExperienceToDTO(Experience experience) {
        ExperienceDTO dto = new ExperienceDTO();
        dto.setId(experience.getId());
        dto.setCompany(experience.getCompany());
        dto.setPosition(experience.getPosition());
        dto.setLocation(experience.getLocation());
        dto.setStartDate(experience.getStartDate());
        dto.setEndDate(experience.getEndDate());
        dto.setCurrent(experience.isCurrent());
        dto.setDescription(experience.getDescription());
        return dto;
    }

    private AchievementDTO mapAchievementToDTO(Achievement achievement) {
        AchievementDTO dto = new AchievementDTO();
        dto.setId(achievement.getId());
        dto.setTitle(achievement.getTitle());
        dto.setOrganization(achievement.getOrganization());
        dto.setDuration(achievement.getDuration());
        dto.setDescription(achievement.getDescription());
        return dto;
    }
}
