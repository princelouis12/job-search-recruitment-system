package com.jobportal.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.jobportal.dto.EmployerProfileRequest;
import com.jobportal.service.ProfileService;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {
    
    @Autowired
    private ProfileService profileService;

    @GetMapping("/employer")
    public ResponseEntity<?> getEmployerProfile(@AuthenticationPrincipal UserDetails userDetails) {
        return profileService.getEmployerProfile(userDetails.getUsername());
    }

    @PutMapping("/employer")
    public ResponseEntity<?> updateEmployerProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody EmployerProfileRequest request) {
        return profileService.updateEmployerProfile(userDetails.getUsername(), request);
    }

    @PostMapping("/employer/image")
    public ResponseEntity<?> uploadProfileImage(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam("file") MultipartFile file,
            @RequestParam("type") String imageType) {
        return profileService.updateProfileImage(userDetails.getUsername(), file, imageType);
    }
}