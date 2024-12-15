package com.jobportal.dto;

import lombok.Data;

@Data
public class EmailRequest {
    private String subject;
    private String content;
}