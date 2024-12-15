package com.jobportal.dto;

import lombok.Data;

@Data
public class EmployerProfileResponse {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String location;
    private String bio;
    private String experience;
    private String companySize;
    private String industry;
    private String website;
    private String avatarUrl;
    private String companyLogoUrl;
}
