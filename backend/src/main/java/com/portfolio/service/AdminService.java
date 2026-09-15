package com.portfolio.service;

import com.portfolio.dto.CustomerSummaryDTO;
import com.portfolio.exception.BadRequestException;
import com.portfolio.exception.ResourceNotFoundException;
import com.portfolio.model.*;
import com.portfolio.repository.InviteTokenRepository;
import com.portfolio.repository.PortfolioRepository;
import com.portfolio.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private InviteTokenRepository inviteTokenRepository;

    @Autowired
    private PortfolioRepository portfolioRepository;

    @Autowired
    private EmailService emailService;

    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    public CustomerSummaryDTO inviteCustomer(String rawEmail) {
        String email = rawEmail.trim().toLowerCase();

        User user = userRepository.findByEmail(email).orElse(null);
        if (user != null) {
            if (user.getRole() == Role.SUPERADMIN) {
                throw new BadRequestException("Superadmin email cannot be invited as a customer");
            }
            if (user.getStatus() == UserStatus.ACTIVE) {
                throw new BadRequestException("A customer with email " + email + " is already active");
            }
        } else {
            user = new User(null, email, null, Role.CUSTOMER, UserStatus.INVITED);
            user = userRepository.save(user);
        }

        // Generate UUID invite token valid for 48 hours
        String tokenString = UUID.randomUUID().toString();
        LocalDateTime expiresAt = LocalDateTime.now().plusHours(48);

        // Deactivate old tokens if any
        inviteTokenRepository.findByUserAndUsedFalse(user).ifPresent(t -> {
            t.setUsed(true);
            inviteTokenRepository.save(t);
        });

        InviteToken inviteToken = new InviteToken(user, tokenString, expiresAt);
        inviteTokenRepository.save(inviteToken);

        emailService.sendInviteEmail(email, tokenString);

        CustomerSummaryDTO dto = new CustomerSummaryDTO();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setStatus(user.getStatus());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setActiveInviteToken(tokenString);
        dto.setSetupUrl(frontendUrl + "/setup-account?token=" + tokenString);

        return dto;
    }

    public List<CustomerSummaryDTO> getAllCustomers() {
        List<User> customers = userRepository.findByRole(Role.CUSTOMER);
        List<CustomerSummaryDTO> result = new ArrayList<>();

        for (User user : customers) {
            CustomerSummaryDTO dto = new CustomerSummaryDTO();
            dto.setId(user.getId());
            dto.setName(user.getName());
            dto.setEmail(user.getEmail());
            dto.setStatus(user.getStatus());
            dto.setCreatedAt(user.getCreatedAt());

            Portfolio portfolio = portfolioRepository.findByUser(user).orElse(null);
            if (portfolio != null) {
                dto.setPortfolioCreated(true);
                dto.setPublished(portfolio.isPublished());
                dto.setSlug(portfolio.getSlug());
            } else {
                dto.setPortfolioCreated(false);
                dto.setPublished(false);
            }

            if (user.getStatus() == UserStatus.INVITED) {
                inviteTokenRepository.findByUserAndUsedFalse(user).ifPresent(token -> {
                    if (!token.isExpired()) {
                        dto.setActiveInviteToken(token.getToken());
                        dto.setSetupUrl(frontendUrl + "/setup-account?token=" + token.getToken());
                    }
                });
            }

            result.add(dto);
        }

        return result;
    }

    public CustomerSummaryDTO resendInvite(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + userId));

        if (user.getRole() != Role.CUSTOMER) {
            throw new BadRequestException("Can only send invite to customer users");
        }

        return inviteCustomer(user.getEmail());
    }

    public CustomerSummaryDTO disableCustomer(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + userId));

        if (user.getRole() != Role.CUSTOMER) {
            throw new BadRequestException("Cannot disable non-customer accounts");
        }

        if (user.getStatus() == UserStatus.DISABLED) {
            user.setStatus(UserStatus.ACTIVE);
        } else {
            user.setStatus(UserStatus.DISABLED);
        }

        userRepository.save(user);

        CustomerSummaryDTO dto = new CustomerSummaryDTO();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setStatus(user.getStatus());
        dto.setCreatedAt(user.getCreatedAt());

        Portfolio portfolio = portfolioRepository.findByUser(user).orElse(null);
        if (portfolio != null) {
            dto.setPortfolioCreated(true);
            dto.setPublished(portfolio.isPublished());
            dto.setSlug(portfolio.getSlug());
        }

        return dto;
    }
}
