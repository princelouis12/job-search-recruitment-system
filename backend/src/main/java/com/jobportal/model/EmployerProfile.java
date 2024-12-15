package com.jobportal.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "employer_profiles")
@Data
public class EmployerProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String phone;
    private String location;
    
    @Column(length = 1000)
    private String bio;
    
    @Column(length = 2000)
    private String experience;
    
    private String companySize;
    private String industry;
    private String website;
    
    @Column(name = "avatar_url")
    private String avatarUrl;
    
    @Column(name = "company_logo_url")
    private String companyLogoUrl;
}