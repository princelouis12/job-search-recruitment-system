package com.jobportal.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "jobs")
@Data
public class Job {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, length = 2000)
    private String description;

    @Column(nullable = false)
    private String company;

    @Column(nullable = false)
    private String location;

    private String type; // Full-time, Part-time, Contract

    private String salary;

    @ElementCollection
    private List<String> requirements = new ArrayList<>();

    @ElementCollection
    private List<String> skills = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "employer_id", nullable = false)
    private User employer;

    private LocalDateTime postedDate;

    private LocalDateTime deadline;

    private boolean active = true;

    @OneToMany(mappedBy = "job", cascade = CascadeType.ALL)
    private List<JobApplication> applications = new ArrayList<>();
}