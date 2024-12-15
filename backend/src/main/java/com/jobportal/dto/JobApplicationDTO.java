package com.jobportal.dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class JobApplicationDTO {
    private Long jobId;
    private String coverLetter;
    private MultipartFile resume;
}