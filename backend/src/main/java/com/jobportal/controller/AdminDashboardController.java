package com.jobportal.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.jobportal.service.DashboardService;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminDashboardController {
    
    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/stats")
    public ResponseEntity<?> getAdminStats() {
        return dashboardService.getAdminStats();
    }

    @GetMapping("/user-activity")
    public ResponseEntity<?> getUserActivity() {
        return dashboardService.getUserActivity();
    }

    @GetMapping("/recent-activities")
    public ResponseEntity<?> getRecentActivities() {
        return dashboardService.getRecentActivities();
    }
}