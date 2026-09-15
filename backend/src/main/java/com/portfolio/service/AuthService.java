package com.portfolio.service;

import com.portfolio.dto.AuthResponse;
import com.portfolio.dto.LoginRequest;
import com.portfolio.dto.SetupAccountRequest;
import com.portfolio.exception.BadRequestException;
import com.portfolio.exception.ResourceNotFoundException;
import com.portfolio.model.*;
import com.portfolio.repository.InviteTokenRepository;
import com.portfolio.repository.PortfolioRepository;
import com.portfolio.repository.UserRepository;
import com.portfolio.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Locale;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private InviteTokenRepository inviteTokenRepository;

    @Autowired
    private PortfolioRepository portfolioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    public AuthResponse login(LoginRequest loginRequest) {
        User user = userRepository.findByEmail(loginRequest.getEmail().toLowerCase())
                .orElseThrow(() -> new BadRequestException("Invalid email or password"));

        if (user.getStatus() == UserStatus.DISABLED) {
            throw new BadRequestException("Your account has been disabled by the administrator");
        }

        if (user.getStatus() == UserStatus.INVITED) {
            throw new BadRequestException("Please set up your account first using the invite link sent to your email");
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail().toLowerCase(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        String slug = null;
        if (user.getRole() == Role.CUSTOMER) {
            slug = portfolioRepository.findByUser(user)
                    .map(Portfolio::getSlug)
                    .orElse(null);
        }

        return new AuthResponse(jwt, user.getId(), user.getName(), user.getEmail(), user.getRole(), slug);
    }

    public void validateInviteToken(String token) {
        InviteToken inviteToken = inviteTokenRepository.findByToken(token)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid or non-existent invite token"));

        if (inviteToken.isUsed()) {
            throw new BadRequestException("This invite link has already been used");
        }

        if (inviteToken.isExpired()) {
            throw new BadRequestException("This invite link has expired. Please request a new invite from the administrator");
        }
    }

    public AuthResponse setupAccount(SetupAccountRequest request) {
        InviteToken inviteToken = inviteTokenRepository.findByToken(request.getToken())
                .orElseThrow(() -> new ResourceNotFoundException("Invalid or non-existent invite token"));

        if (inviteToken.isUsed()) {
            throw new BadRequestException("This invite link has already been used");
        }

        if (inviteToken.isExpired()) {
            throw new BadRequestException("This invite link has expired");
        }

        User user = inviteToken.getUser();
        user.setName(request.getName());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setStatus(UserStatus.ACTIVE);
        userRepository.save(user);

        inviteToken.setUsed(true);
        inviteTokenRepository.save(inviteToken);

        // Ensure user has a portfolio 1:1 initialized
        Portfolio portfolio = portfolioRepository.findByUser(user).orElse(null);
        if (portfolio == null) {
            String baseSlug = request.getName().toLowerCase(Locale.ROOT)
                    .replaceAll("[^a-z0-9]", "-")
                    .replaceAll("-+", "-")
                    .replaceAll("^-|-$", "");
            if (baseSlug.isBlank()) {
                baseSlug = "user-" + user.getId();
            }

            String uniqueSlug = baseSlug;
            int counter = 1;
            while (portfolioRepository.existsBySlug(uniqueSlug)) {
                uniqueSlug = baseSlug + "-" + counter++;
            }

            portfolio = new Portfolio(user, uniqueSlug);
            portfolio.setTitle(request.getName() + "'s Portfolio");
            portfolio.setBio("Welcome to my professional portfolio page!");
            portfolioRepository.save(portfolio);
        }

        // Authenticate new customer and return JWT token
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getEmail(), request.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        return new AuthResponse(jwt, user.getId(), user.getName(), user.getEmail(), user.getRole(), portfolio.getSlug());
    }
}
