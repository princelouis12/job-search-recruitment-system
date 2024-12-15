package com.jobportal.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jobportal.service.DashboardService;

@RestController
@RequestMapping("/api/employer")
@PreAuthorize("hasRole('EMPLOYER')")
public class EmployerDashboardController {
    
    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/stats")
    public ResponseEntity<?> getEmployerStats(@AuthenticationPrincipal UserDetails userDetails) {
        return dashboardService.getEmployerStats(userDetails.getUsername());
    }

    @GetMapping("/applications/recent")
    public ResponseEntity<?> getRecentApplications(@AuthenticationPrincipal UserDetails userDetails) {
        return dashboardService.getRecentApplications(userDetails.getUsername());
    }
}