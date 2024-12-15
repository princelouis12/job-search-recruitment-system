package com.jobportal.controller;

import java.io.IOException;
import java.nio.file.Files;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import com.jobportal.service.FileStorageService;
import com.jobportal.service.JobApplicationService;

@RestController
@RequestMapping("/api/files")
public class FileController {

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private JobApplicationService applicationService;

    @GetMapping("/{fileName:.+}")
    public ResponseEntity<Resource> getFile(@PathVariable String fileName) {
        Resource file = fileStorageService.loadFileAsResource(fileName);
        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_JPEG)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + file.getFilename() + "\"")
                .body(file);
    }

    @GetMapping("/files/{fileName:.+}")
    @PreAuthorize("hasAnyRole('EMPLOYER', 'JOBSEEKER', 'ADMIN')")
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileName) {
        try {
            Resource resource = fileStorageService.loadFileAsResource(fileName);

            String contentType = "application/octet-stream";
            try {
                contentType = Files.probeContentType(resource.getFile().toPath());
            } catch (IOException ex) {
                // Fallback to default content type
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

    @GetMapping("/resume/{applicationId}")
    @PreAuthorize("hasAnyRole('EMPLOYER', 'ADMIN')")
    public ResponseEntity<Resource> getApplicationResume(
            @PathVariable Long applicationId,
            @RequestParam(required = false) String download,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        try {
            // Get the resume file name from the application using the authenticated user's email
            String resumeFileName = applicationService.getResumeUrl(applicationId, userDetails.getUsername());
            Resource resource = fileStorageService.loadFileAsResource(resumeFileName);

            String contentType = Files.probeContentType(resource.getFile().toPath());
            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            // Determine if the file should be downloaded or displayed inline
            String contentDisposition = download != null ? 
                "attachment; filename=\"" + resource.getFilename() + "\"" :
                "inline; filename=\"" + resource.getFilename() + "\"";

            return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, contentDisposition)
                .body(resource);
                
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}