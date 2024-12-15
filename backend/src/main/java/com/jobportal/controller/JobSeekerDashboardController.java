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
@RequestMapping("/api/jobseeker")
@PreAuthorize("hasRole('JOBSEEKER')")
public class JobSeekerDashboardController {
    
    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/stats")
    public ResponseEntity<?> getJobSeekerStats(@AuthenticationPrincipal UserDetails userDetails) {
        return dashboardService.getJobSeekerStats(userDetails.getUsername());
    }

    @GetMapping("/jobs/recommended")
    public ResponseEntity<?> getRecommendedJobs(@AuthenticationPrincipal UserDetails userDetails) {
        return dashboardService.getRecommendedJobs(userDetails.getUsername());
    }
}