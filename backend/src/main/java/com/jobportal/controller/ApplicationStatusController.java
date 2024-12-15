package com.jobportal.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import com.jobportal.model.ApplicationStatus;
import com.jobportal.model.JobApplication;
import com.jobportal.service.JobApplicationService;

import jakarta.validation.constraints.NotBlank;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/applications")
public class ApplicationStatusController {
    private static final Logger logger = LoggerFactory.getLogger(ApplicationStatusController.class);

    @Autowired
    private JobApplicationService jobApplicationService;

    // Data class for status update request
    public static class StatusUpdateRequest {
        @NotBlank(message = "Status is required")
        private String status;
        private String feedback;

        // Getters and setters
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public String getFeedback() { return feedback; }
        public void setFeedback(String feedback) { this.feedback = feedback; }
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<?> updateApplicationStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> request,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        logger.debug("Received status update request for application: {}", id);
        
        try {
            JobApplication updatedApplication = jobApplicationService.updateApplicationStatus(
                id,
                request.get("status"),
                request.get("feedback"),
                userDetails.getUsername()
            );
            return ResponseEntity.ok(updatedApplication);
        } catch (Exception e) {
            logger.error("Error updating application status", e);
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

//     @PostMapping("/{id}/acknowledge")
// @PreAuthorize("hasRole('EMPLOYER')")
// public ResponseEntity<?> sendAcknowledgement(
//     @PathVariable Long id,
//     @AuthenticationPrincipal UserDetails userDetails) {
//     try {
//         JobApplication application = JobApplicationService.sendAcknowledgementEmail(id, userDetails.getUsername());
//         return ResponseEntity.ok(application);
//     } catch (Exception e) {
//         logger.error("Error sending acknowledgement", e);
//         return ResponseEntity.badRequest().body(e.getMessage());
//     }
// }



    @GetMapping("/{id}/status-history")
    @PreAuthorize("hasAnyRole('EMPLOYER', 'JOBSEEKER')")
    public ResponseEntity<?> getApplicationStatusHistory(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
            
        logger.info("Fetching status history for application ID: {}", id);
        
        try {
            JobApplication application = jobApplicationService.getApplicationById(id, userDetails.getUsername());
            
            // For now returning current status, in future can be expanded to include full history
            Map<String, Object> response = new HashMap<>();
            response.put("currentStatus", application.getStatus());
            response.put("lastUpdated", application.getAppliedDate());
            response.put("feedback", application.getFeedback());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error fetching application status history", e);
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(e.getMessage());
        }
    }

    @GetMapping("/status-config")
    public ResponseEntity<?> getStatusConfiguration() {
        Map<String, Object> config = new HashMap<>();
        
        // Add status configurations
        for (ApplicationStatus status : ApplicationStatus.values()) {
            Map<String, Object> statusConfig = new HashMap<>();
            statusConfig.put("label", status.name());
            statusConfig.put("description", getStatusDescription(status));
            statusConfig.put("requiresFeedback", requiresFeedback(status));
            statusConfig.put("allowedTransitions", getAllowedTransitions(status));
            
            config.put(status.name(), statusConfig);
        }
        
        return ResponseEntity.ok(config);
    }

    private String getStatusDescription(ApplicationStatus status) {
        switch (status) {
            case PENDING:
                return "Application submitted but not yet reviewed";
            case REVIEWING:
                return "Application is being reviewed by the employer";
            case SHORTLISTED:
                return "Candidate has been shortlisted for interview";
            case INTERVIEWED:
                return "Interview has been completed";
            case OFFERED:
                return "Job offer has been extended";
            case ACCEPTED:
                return "Offer has been accepted by the candidate";
            case REJECTED:
                return "Application has been rejected";
            default:
                return "Unknown status";
        }
    }

    private boolean requiresFeedback(ApplicationStatus status) {
        switch (status) {
            case REJECTED:
            case REVIEWING:
            case SHORTLISTED:
            case INTERVIEWED:
            case OFFERED:
                return true;
            default:
                return false;
        }
    }

    private String[] getAllowedTransitions(ApplicationStatus status) {
        switch (status) {
            case PENDING:
                return new String[]{"REVIEWING", "REJECTED"};
            case REVIEWING:
                return new String[]{"SHORTLISTED", "REJECTED"};
            case SHORTLISTED:
                return new String[]{"INTERVIEWED", "REJECTED"};
            case INTERVIEWED:
                return new String[]{"OFFERED", "REJECTED"};
            case OFFERED:
                return new String[]{"ACCEPTED", "REJECTED"};
            case ACCEPTED:
            case REJECTED:
                return new String[]{};
            default:
                return new String[]{};
        }
    }
}