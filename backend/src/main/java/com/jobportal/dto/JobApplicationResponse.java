package com.jobportal.dto;

import lombok.Data;
import com.jobportal.model.ApplicationStatus;
import java.time.LocalDateTime;

@Data
public class JobApplicationResponse {
    private Long id;
    private JobResponse job;
    private UserResponse applicant;
    private String coverLetter;
    private String resumeUrl;
    private LocalDateTime appliedDate;
    private ApplicationStatus status;
    private String feedback;
}