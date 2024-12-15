package com.jobportal.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.jobportal.dto.JobRequest;
import com.jobportal.dto.JobResponse;
import com.jobportal.mapper.JobMapper;
import com.jobportal.model.Job;
import com.jobportal.model.User;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class JobService {
    
    @Autowired
    private JobRepository jobRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private JobMapper jobMapper;

    public ResponseEntity<?> createJob(JobRequest jobRequest, String userEmail) {
        Optional<User> userOpt = userRepository.findByEmail(userEmail);
        if (!userOpt.isPresent()) {
            return ResponseEntity.badRequest().body("User not found");
        }

        User employer = userOpt.get();
        if (!employer.getRole().toString().equals("EMPLOYER")) {
            return ResponseEntity.badRequest().body("Only employers can create jobs");
        }

        Job job = new Job();
        job.setTitle(jobRequest.getTitle());
        job.setDescription(jobRequest.getDescription());
        job.setCompany(jobRequest.getCompany());
        job.setLocation(jobRequest.getLocation());
        job.setType(jobRequest.getType());
        job.setSalary(jobRequest.getSalary());
        job.setRequirements(jobRequest.getRequirements());
        job.setSkills(jobRequest.getSkills());
        job.setEmployer(employer);
        job.setPostedDate(LocalDateTime.now());
        job.setDeadline(jobRequest.getDeadline());
        job.setActive(true);

        Job savedJob = jobRepository.save(job);
        return ResponseEntity.ok(jobMapper.toResponse(savedJob));
    }

    public ResponseEntity<?> getAllJobs(String search, String location, String type) {
        List<Job> jobs = jobRepository.findByActiveTrue();
        
        // Apply filters if provided
        if (search != null && !search.isEmpty()) {
            jobs = jobs.stream()
                .filter(job -> job.getTitle().toLowerCase().contains(search.toLowerCase()) ||
                             job.getDescription().toLowerCase().contains(search.toLowerCase()))
                .collect(Collectors.toList());
        }
        
        if (location != null && !location.isEmpty()) {
            jobs = jobs.stream()
                .filter(job -> job.getLocation().toLowerCase().contains(location.toLowerCase()))
                .collect(Collectors.toList());
        }
        
        if (type != null && !type.isEmpty() && !type.equals("all")) {
            jobs = jobs.stream()
                .filter(job -> job.getType().equals(type))
                .collect(Collectors.toList());
        }

        List<JobResponse> jobResponses = jobs.stream()
            .map(jobMapper::toResponse)
            .collect(Collectors.toList());

        return ResponseEntity.ok(jobResponses);
    }

    public ResponseEntity<?> getEmployerJobs(String userEmail) {
        Optional<User> userOpt = userRepository.findByEmail(userEmail);
        if (!userOpt.isPresent()) {
            return ResponseEntity.badRequest().body("User not found");
        }

        User employer = userOpt.get();
        if (!employer.getRole().toString().equals("EMPLOYER")) {
            return ResponseEntity.badRequest().body("Only employers can view their job listings");
        }

        List<Job> jobs = jobRepository.findByEmployerId(employer.getId());
        List<JobResponse> jobResponses = jobs.stream()
            .map(jobMapper::toResponse)
            .collect(Collectors.toList());

        return ResponseEntity.ok(jobResponses);
    }

    public ResponseEntity<?> getJobById(Long id) {
        Optional<Job> jobOpt = jobRepository.findById(id);
        if (!jobOpt.isPresent()) {
            return ResponseEntity.badRequest().body("Job not found");
        }

        return ResponseEntity.ok(jobMapper.toResponse(jobOpt.get()));
    }

    public ResponseEntity<?> updateJob(Long id, JobRequest jobRequest, String userEmail) {
        Optional<Job> jobOpt = jobRepository.findById(id);
        if (!jobOpt.isPresent()) {
            return ResponseEntity.badRequest().body("Job not found");
        }

        Optional<User> userOpt = userRepository.findByEmail(userEmail);
        if (!userOpt.isPresent()) {
            return ResponseEntity.badRequest().body("User not found");
        }

        Job job = jobOpt.get();
        User user = userOpt.get();

        // Verify that the user is the employer of this job
        if (!job.getEmployer().getId().equals(user.getId())) {
            return ResponseEntity.badRequest().body("Not authorized to update this job");
        }

        job.setTitle(jobRequest.getTitle());
        job.setDescription(jobRequest.getDescription());
        job.setCompany(jobRequest.getCompany());
        job.setLocation(jobRequest.getLocation());
        job.setType(jobRequest.getType());
        job.setSalary(jobRequest.getSalary());
        job.setRequirements(jobRequest.getRequirements());
        job.setSkills(jobRequest.getSkills());
        job.setDeadline(jobRequest.getDeadline());

        Job updatedJob = jobRepository.save(job);
        return ResponseEntity.ok(jobMapper.toResponse(updatedJob));
    }

    public ResponseEntity<?> deleteJob(Long id, String userEmail) {
        Optional<Job> jobOpt = jobRepository.findById(id);
        if (!jobOpt.isPresent()) {
            return ResponseEntity.badRequest().body("Job not found");
        }

        Optional<User> userOpt = userRepository.findByEmail(userEmail);
        if (!userOpt.isPresent()) {
            return ResponseEntity.badRequest().body("User not found");
        }

        Job job = jobOpt.get();
        User user = userOpt.get();

        // Verify that the user is the employer of this job
        if (!job.getEmployer().getId().equals(user.getId())) {
            return ResponseEntity.badRequest().body("Not authorized to delete this job");
        }

        // Soft delete by setting active to false
        job.setActive(false);
        jobRepository.save(job);

        return ResponseEntity.ok().build();
    }
}