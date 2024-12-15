package com.jobportal.dto;

import lombok.Data;

@Data
public class ApplicationStatusResponse {
    private Long id;
    private String status;
    private String feedback;
    private String message;
}