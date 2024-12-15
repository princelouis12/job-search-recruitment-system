package com.jobportal.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class JobResponse {
    private Long id;
    private String title;
    private String description;
    private String company;
    private String location;
    private String type;
    private String salary;
    private List<String> requirements;
    private List<String> skills;
    private UserResponse employer;
    private LocalDateTime postedDate;
    private LocalDateTime deadline;
    private boolean active;
    private int totalApplications;
}
