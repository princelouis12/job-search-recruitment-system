package com.jobportal.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;  // Changed this import
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.jobportal.dto.JobApplicationResponse;
import com.jobportal.mapper.JobApplicationMapper;
import com.jobportal.model.JobApplication;
import com.jobportal.service.FileStorageService;
import com.jobportal.service.JobApplicationService;

import jakarta.persistence.EntityNotFoundException;

@RestController
@RequestMapping("/api/applications")
public class JobApplicationController {
    @Autowired
    private JobApplicationService applicationService;
    
    @Autowired
    private JobApplicationMapper applicationMapper;

    @Autowired
    private FileStorageService fileStorageService; 

    @PostMapping
    @PreAuthorize("hasRole('JOBSEEKER')")
    public ResponseEntity<?> submitApplication(
            @RequestParam("jobId") Long jobId,
            @RequestParam("coverLetter") String coverLetter,
            @RequestParam("resume") MultipartFile resume,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            JobApplication application = applicationService.submitApplication(
                jobId, coverLetter, resume, userDetails.getUsername());
            return ResponseEntity.ok(applicationMapper.toResponse(application));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to submit application: " + e.getMessage());
        }
    }


    

    @PostMapping("/{id}/acknowledge")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<?> sendAcknowledgement(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            applicationService.sendAcknowledgementEmail(id, userDetails.getUsername());
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to send acknowledgement: " + e.getMessage());
        }
    }

    

    @GetMapping("/files/{fileName:.+}")
    @PreAuthorize("hasAnyRole('EMPLOYER', 'JOBSEEKER', 'ADMIN')")
    public ResponseEntity<Resource> getFile(@PathVariable String fileName,
                                          @AuthenticationPrincipal UserDetails userDetails) {
        try {
            // Verify access rights
            if (!applicationService.canAccessFile(fileName, userDetails.getUsername())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            Resource resource = fileStorageService.loadFileAsResource(fileName);
            String contentType = null;

            try {
                contentType = Files.probeContentType(resource.getFile().toPath());
            } catch (IOException ex) {
                contentType = "application/octet-stream";
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, 
                           "inline; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);

        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/my-applications")
    @PreAuthorize("hasRole('JOBSEEKER')")
    public ResponseEntity<?> getMyApplications(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            List<JobApplication> applications = applicationService.getApplicationsByUser(userDetails.getUsername());
            List<JobApplicationResponse> responses = applications.stream()
                .map(applicationMapper::toResponse)
                .collect(Collectors.toList());
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to fetch applications: " + e.getMessage());
        }
    }

    @GetMapping("/applicant")
    @PreAuthorize("hasRole('JOBSEEKER')")
    public ResponseEntity<?> getApplicantApplications(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            List<JobApplication> applications = applicationService.getApplicantApplications(userDetails.getUsername());
            List<JobApplicationResponse> responses = applications.stream()
                .map(applicationMapper::toResponse)
                .collect(Collectors.toList());
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to fetch applications: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
@PreAuthorize("hasRole('EMPLOYER')")
public ResponseEntity<?> getApplicationById(
    @PathVariable Long id,
    @AuthenticationPrincipal UserDetails userDetails) {
    try {
        JobApplication application = applicationService.getApplicationById(id, userDetails.getUsername());
        return ResponseEntity.ok(applicationMapper.toResponse(application));
    } catch (EntityNotFoundException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                           .body("Application not found with id: " + id);
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                           .body("Error retrieving application: " + e.getMessage());
    }
}

@GetMapping("/employer/{id}")
@PreAuthorize("hasRole('EMPLOYER')")
public ResponseEntity<?> getEmployerApplicationDetails(
    @PathVariable Long id,
    @AuthenticationPrincipal UserDetails userDetails) {
    try {
        JobApplication application = applicationService.getApplicationById(id, userDetails.getUsername());
        return ResponseEntity.ok(applicationMapper.toResponse(application));
    } catch (EntityNotFoundException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                           .body("Application not found: " + e.getMessage());
    } catch (AccessDeniedException e) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                           .body("Access denied: " + e.getMessage());
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                           .body("Error processing request: " + e.getMessage());
    }
}

    public ResponseEntity<?> getApplicationDetails(
    @PathVariable Long id,
    @AuthenticationPrincipal UserDetails userDetails) {
    try {
        JobApplication application = applicationService.getApplicationById(id, userDetails.getUsername());
        return ResponseEntity.ok(applicationMapper.toResponse(application));
    } catch (Exception e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }
}

    @GetMapping("/job/{jobId}")
    public ResponseEntity<?> getJobApplications(
            @PathVariable Long jobId,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            List<JobApplication> applications = applicationService.getJobApplications(jobId, userDetails.getUsername());
            List<JobApplicationResponse> responses = applications.stream()
                .map(applicationMapper::toResponse)
                .collect(Collectors.toList());
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to fetch applications: " + e.getMessage());
        }
    }

//     @PutMapping("/{id}/status")
// @PreAuthorize("hasRole('EMPLOYER')")
// public ResponseEntity<?> updateApplicationStatus(
//         @PathVariable Long id,
//         @Valid @RequestBody StatusUpdateRequest request,
//         @AuthenticationPrincipal UserDetails userDetails) {
    
//     logger.debug("Received status update request. ID: {}, New Status: {}, User: {}", 
//         id, request.getStatus(), userDetails.getUsername());
    
//     try {
//         JobApplication updatedApplication = applicationService.updateApplicationStatus(
//             id,
//             request.getStatus(),
//             request.getFeedback(),
//             userDetails.getUsername()
//         );
//         return ResponseEntity.ok(updatedApplication);
//     } catch (Exception e) {
//         logger.error("Error updating application status", e);
//         return ResponseEntity.badRequest().body(e.getMessage());
//     }
// }
}