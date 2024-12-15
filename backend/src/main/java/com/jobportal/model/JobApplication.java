package com.jobportal.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "job_applications")
@Data
public class JobApplication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @ManyToOne
    @JoinColumn(name = "applicant_id", nullable = false)
    private User applicant;

    @Column(nullable = false)
    private LocalDateTime appliedDate;

    @Enumerated(EnumType.STRING)
    private ApplicationStatus status = ApplicationStatus.PENDING;

    @Column(columnDefinition = "TEXT")  
    private String coverLetter;

    @Column(length = 1000)  
    private String resumeUrl;

    @Column(columnDefinition = "TEXT")
    private String feedback;

    
}