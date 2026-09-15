package com.portfolio.controller;

import com.portfolio.dto.CustomerSummaryDTO;
import com.portfolio.dto.InviteRequest;
import com.portfolio.service.AdminService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('SUPERADMIN')")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @PostMapping("/invite")
    public ResponseEntity<CustomerSummaryDTO> inviteCustomer(@Valid @RequestBody InviteRequest inviteRequest) {
        CustomerSummaryDTO response = adminService.inviteCustomer(inviteRequest.getEmail());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/customers")
    public ResponseEntity<List<CustomerSummaryDTO>> getCustomers() {
        List<CustomerSummaryDTO> customers = adminService.getAllCustomers();
        return ResponseEntity.ok(customers);
    }

    @PostMapping("/resend-invite/{userId}")
    public ResponseEntity<CustomerSummaryDTO> resendInvite(@PathVariable("userId") Long userId) {
        CustomerSummaryDTO response = adminService.resendInvite(userId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/disable/{userId}")
    public ResponseEntity<CustomerSummaryDTO> toggleDisableCustomer(@PathVariable("userId") Long userId) {
        CustomerSummaryDTO response = adminService.disableCustomer(userId);
        return ResponseEntity.ok(response);
    }
}
