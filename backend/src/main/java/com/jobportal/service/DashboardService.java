package com.jobportal.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import com.jobportal.repository.*;
import com.jobportal.model.*;
import java.time.*;
import java.util.*;

@Service
public class DashboardService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private JobRepository jobRepository;
    
    @Autowired
    private JobApplicationRepository applicationRepository;

    public ResponseEntity<?> getAdminStats() {
        try {
            long totalUsers = userRepository.count();
            long activeJobs = jobRepository.countByActiveTrue();
            long todayApplications = applicationRepository.countByAppliedDateAfter(
                LocalDateTime.now().withHour(0).withMinute(0));

            Map<String, Object> stats = new HashMap<>();
            stats.put("totalUsers", totalUsers);
            stats.put("activeJobs", activeJobs);
            stats.put("applicationsToday", todayApplications);
            
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching admin stats: " + e.getMessage());
        }
    }

    public ResponseEntity<?> getUserActivity() {
        try {
            LocalDateTime startDate = LocalDateTime.now().minusDays(30);
            List<Map<String, Object>> activity = userRepository.getUserActivityByDay(startDate);
            return ResponseEntity.ok(activity);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching user activity: " + e.getMessage());
        }
    }

    public ResponseEntity<?> getRecentActivities() {
        try {
            List<Map<String, Object>> activities = userRepository.getRecentActivities();
            return ResponseEntity.ok(activities);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching recent activities: " + e.getMessage());
        }
    }

    public ResponseEntity<?> getEmployerStats(String email) {
        try {
            User employer = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

            long activeJobs = jobRepository.countByEmployerAndActiveTrue(employer);
            long totalApplications = applicationRepository.countByJobEmployer(employer);
            long hiredCandidates = applicationRepository.countByJobEmployerAndStatus(
                employer, ApplicationStatus.ACCEPTED);

            Map<String, Object> stats = new HashMap<>();
            stats.put("activeJobs", activeJobs);
            stats.put("totalApplications", totalApplications);
            stats.put("hiredCandidates", hiredCandidates);

            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching employer stats: " + e.getMessage());
        }
    }

    public ResponseEntity<?> getRecentApplications(String email) {
        try {
            User employer = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

            List<JobApplication> applications = applicationRepository
                .findTop10ByJobEmployerOrderByAppliedDateDesc(employer);

            return ResponseEntity.ok(applications);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching recent applications: " + e.getMessage());
        }
    }

    public ResponseEntity<?> getJobSeekerStats(String email) {
        try {
            User jobSeeker = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

            Map<String, Object> stats = new HashMap<>();
            stats.put("totalApplications", applicationRepository.countByApplicant(jobSeeker));
            stats.put("interviews", applicationRepository.countByApplicantAndStatus(
                jobSeeker, ApplicationStatus.INTERVIEWED));
            stats.put("profileViews", 0); // Implement profile views tracking later

            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching job seeker stats: " + e.getMessage());
        }
    }

    public ResponseEntity<?> getRecommendedJobs(String email) {
        try {
            // Verify user exists
            userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

            // For now, just return recent active jobs
            // TODO: Implement proper job recommendation logic based on user's skills and preferences
            List<Job> recommendedJobs = jobRepository.findTop10ByActiveTrueOrderByPostedDateDesc();
            return ResponseEntity.ok(recommendedJobs);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching recommended jobs: " + e.getMessage());
        }
    }
}