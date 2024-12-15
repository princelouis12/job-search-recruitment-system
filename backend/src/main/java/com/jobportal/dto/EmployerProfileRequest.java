package com.jobportal.dto;

import lombok.Data;

@Data
public class EmployerProfileRequest {
    private String phone;
    private String location;
    private String bio;
    private String experience;
    private String companySize;
    private String industry;
    private String website;
}