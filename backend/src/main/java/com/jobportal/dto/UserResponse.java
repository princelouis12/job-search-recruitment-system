package com.jobportal.dto;

import lombok.Data;
import com.jobportal.model.Role;

@Data
public class UserResponse {
    private Long id;
    private String name;
    private String email;
    private Role role;
    // Excluding sensitive information like password
    private String location;
    private String phone;
    // Additional profile fields can be added here
}