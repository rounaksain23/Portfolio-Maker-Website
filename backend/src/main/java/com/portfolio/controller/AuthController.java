package com.portfolio.controller;

import com.portfolio.dto.AuthResponse;
import com.portfolio.dto.LoginRequest;
import com.portfolio.dto.SetupAccountRequest;
import com.portfolio.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        AuthResponse response = authService.login(loginRequest);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/validate-invite")
    public ResponseEntity<Map<String, Boolean>> validateInvite(@RequestParam("token") String token) {
        authService.validateInviteToken(token);
        return ResponseEntity.ok(Collections.singletonMap("valid", true));
    }

    @PostMapping("/setup-account")
    public ResponseEntity<AuthResponse> setupAccount(@Valid @RequestBody SetupAccountRequest request) {
        AuthResponse response = authService.setupAccount(request);
        return ResponseEntity.ok(response);
    }
}
