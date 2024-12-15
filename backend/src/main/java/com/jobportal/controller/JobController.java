package com.jobportal.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import com.jobportal.dto.JobRequest;
import com.jobportal.service.JobService;

@RestController
@RequestMapping("/api/jobs")
public class JobController {
    @Autowired
    private JobService jobService;

    @PostMapping
public ResponseEntity<?> createJob(@RequestBody JobRequest jobRequest, @AuthenticationPrincipal UserDetails userDetails) {
    return jobService.createJob(jobRequest, userDetails.getUsername());
}

    @GetMapping
    public ResponseEntity<?> getAllJobs(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String type) {
        return jobService.getAllJobs(search, location, type);
    }

    @GetMapping("/employer")
public ResponseEntity<?> getEmployerJobs(@AuthenticationPrincipal UserDetails userDetails) {
    return jobService.getEmployerJobs(userDetails.getUsername());
}

    @GetMapping("/{id}")
    public ResponseEntity<?> getJobById(@PathVariable Long id) {
        return jobService.getJobById(id);
    }

    @PutMapping("/{id}")
public ResponseEntity<?> updateJob(@PathVariable Long id, @RequestBody JobRequest jobRequest, @AuthenticationPrincipal UserDetails userDetails) {
    return jobService.updateJob(id, jobRequest, userDetails.getUsername());
}

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteJob(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        return jobService.deleteJob(id, userDetails.getUsername());
    }
}