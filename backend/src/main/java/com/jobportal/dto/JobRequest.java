package com.jobportal.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class JobRequest {
    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotBlank(message = "Company is required")
    private String company;

    @NotBlank(message = "Location is required")
    private String location;

    @NotBlank(message = "Job type is required")
    private String type;  // FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP

    private String salary;

    @NotNull(message = "Requirements list cannot be null")
    private List<String> requirements;

    @NotNull(message = "Skills list cannot be null")
    private List<String> skills;

    @NotNull(message = "Application deadline is required")
    private LocalDateTime deadline;
}