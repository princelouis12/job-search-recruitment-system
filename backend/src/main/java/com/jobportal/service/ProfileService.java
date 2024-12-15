package com.jobportal.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.jobportal.dto.EmployerProfileRequest;
import com.jobportal.dto.EmployerProfileResponse;
import com.jobportal.model.EmployerProfile;
import com.jobportal.model.User;
import com.jobportal.repository.EmployerProfileRepository;
import com.jobportal.repository.UserRepository;

@Service
public class ProfileService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private EmployerProfileRepository profileRepository;
    
    @Autowired
    private FileStorageService fileStorageService;

    public ResponseEntity<?> getEmployerProfile(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new RuntimeException("User not found"));

        EmployerProfile profile = profileRepository.findByUser(user)
            .orElseGet(() -> {
                EmployerProfile newProfile = new EmployerProfile();
                newProfile.setUser(user);
                return profileRepository.save(newProfile);
            });

        return ResponseEntity.ok(mapToResponse(profile));
    }

    public ResponseEntity<?> updateEmployerProfile(String userEmail, EmployerProfileRequest request) {
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new RuntimeException("User not found"));

        EmployerProfile profile = profileRepository.findByUser(user)
            .orElseGet(() -> {
                EmployerProfile newProfile = new EmployerProfile();
                newProfile.setUser(user);
                return newProfile;
            });

        profile.setPhone(request.getPhone());
        profile.setLocation(request.getLocation());
        profile.setBio(request.getBio());
        profile.setExperience(request.getExperience());
        profile.setCompanySize(request.getCompanySize());
        profile.setIndustry(request.getIndustry());
        profile.setWebsite(request.getWebsite());

        EmployerProfile updatedProfile = profileRepository.save(profile);
        return ResponseEntity.ok(mapToResponse(updatedProfile));
    }

    public ResponseEntity<?> updateProfileImage(String userEmail, MultipartFile file, String imageType) {
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new RuntimeException("User not found"));

        EmployerProfile profile = profileRepository.findByUser(user)
            .orElseGet(() -> {
                EmployerProfile newProfile = new EmployerProfile();
                newProfile.setUser(user);
                return newProfile;
            });

        String fileName = fileStorageService.storeFile(file);
        String fileUrl = "/api/files/" + fileName;

        if ("avatar".equals(imageType)) {
            profile.setAvatarUrl(fileUrl);
        } else if ("logo".equals(imageType)) {
            profile.setCompanyLogoUrl(fileUrl);
        }

        EmployerProfile updatedProfile = profileRepository.save(profile);
        return ResponseEntity.ok(mapToResponse(updatedProfile));
    }

    private EmployerProfileResponse mapToResponse(EmployerProfile profile) {
        EmployerProfileResponse response = new EmployerProfileResponse();
        response.setId(profile.getId());
        response.setName(profile.getUser().getName());
        response.setEmail(profile.getUser().getEmail());
        response.setPhone(profile.getPhone());
        response.setLocation(profile.getLocation());
        response.setBio(profile.getBio());
        response.setExperience(profile.getExperience());
        response.setCompanySize(profile.getCompanySize());
        response.setIndustry(profile.getIndustry());
        response.setWebsite(profile.getWebsite());
        response.setAvatarUrl(profile.getAvatarUrl());
        response.setCompanyLogoUrl(profile.getCompanyLogoUrl());
        return response;
    }
}