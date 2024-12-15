package com.jobportal.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.jobportal.model.*;
import com.jobportal.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class JobApplicationService {
    private static final Logger logger = LoggerFactory.getLogger(JobApplicationService.class);
    
    @Autowired
    private JobApplicationRepository applicationRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private EmailService emailService;

    public JobApplication submitApplication(Long jobId, String coverLetter, MultipartFile resume, String userEmail) {
        Job job = jobRepository.findById(jobId)
            .orElseThrow(() -> new EntityNotFoundException("Job not found"));

        User applicant = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new EntityNotFoundException("User not found"));

        if (!applicant.getRole().toString().equals("JOBSEEKER")) {
            throw new IllegalStateException("Only job seekers can apply for jobs");
        }

        if (applicationRepository.existsByJobAndApplicant(job, applicant)) {
            throw new IllegalStateException("You have already applied for this job");
        }

        String resumeUrl = fileStorageService.storeFile(resume);

        JobApplication application = new JobApplication();
        application.setJob(job);
        application.setApplicant(applicant);
        application.setCoverLetter(coverLetter);
        application.setResumeUrl(resumeUrl);
        application.setAppliedDate(LocalDateTime.now());
        application.setStatus(ApplicationStatus.PENDING);

        JobApplication savedApplication = applicationRepository.save(application);

        // Send application confirmation email to job seeker
        sendApplicationConfirmationEmail(savedApplication);

        return savedApplication;
    }

    private void sendApplicationConfirmationEmail(JobApplication application) {
        String subject = "Application Submitted - " + application.getJob().getTitle();
        String body = String.format(
            "Dear %s,\n\n" +
            "Thank you for submitting your application for the %s position at %s.\n\n" +
            "Your application has been received and is currently pending review. " +
            "We will notify you of any updates regarding your application status.\n\n" +
            "Application Details:\n" +
            "Position: %s\n" +
            "Company: %s\n" +
            "Date Applied: %s\n\n" +
            "Best regards,\n" +
            "JobConnect Team",
            application.getApplicant().getName(),
            application.getJob().getTitle(),
            application.getJob().getCompany(),
            application.getJob().getTitle(),
            application.getJob().getCompany(),
            application.getAppliedDate().toString()
        );

        emailService.sendEmail(application.getApplicant().getEmail(), subject, body);
    }

    @Transactional
    public JobApplication sendAcknowledgementEmail(Long applicationId, String employerEmail) {
        JobApplication application = applicationRepository.findById(applicationId)
            .orElseThrow(() -> new EntityNotFoundException("Application not found"));

        User employer = userRepository.findByEmail(employerEmail)
            .orElseThrow(() -> new EntityNotFoundException("Employer not found"));

        // Verify employer owns the job
        if (!application.getJob().getEmployer().getId().equals(employer.getId())) {
            throw new IllegalStateException("Not authorized to acknowledge this application");
        }

        // Send acknowledgement email with initial review message
        String subject = "Application Received - " + application.getJob().getTitle();
        String body = String.format(
            "Dear %s,\n\n" +
            "Thank you for your application for the position of %s at %s.\n\n" +
            "We have received your application and our recruiting team will carefully review your qualifications. " +
            "We will be in touch soon regarding next steps.\n\n" +
            "Best regards,\n" +
            "%s\n" +
            "%s",
            application.getApplicant().getName(),
            application.getJob().getTitle(),
            application.getJob().getCompany(),
            employer.getName(),
            application.getJob().getCompany()
        );

        emailService.sendEmail(application.getApplicant().getEmail(), subject, body);

        // Update application status if still pending
        if (application.getStatus() == ApplicationStatus.PENDING) {
            application.setStatus(ApplicationStatus.REVIEWING);
            application = applicationRepository.save(application);
        }

        return application;
    }

    @Transactional
    public JobApplication updateApplicationStatus(Long id, String status, String feedback, String userEmail) {
        JobApplication application = applicationRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Application not found"));

        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new EntityNotFoundException("User not found"));

        if (!application.getJob().getEmployer().getId().equals(user.getId())) {
            throw new IllegalStateException("Not authorized to update this application");
        }

        try {
            ApplicationStatus newStatus = ApplicationStatus.valueOf(status.toUpperCase());
            application.setStatus(newStatus);
            if (feedback != null && !feedback.isEmpty()) {
                application.setFeedback(feedback);
            }
            
            // Save the updated application
            JobApplication updatedApplication = applicationRepository.save(application);
            
            // Send status-specific acknowledgement email
            sendStatusUpdateEmail(updatedApplication, user);
            
            return updatedApplication;
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid status provided: " + status);
        }
    }

    private void sendStatusUpdateEmail(JobApplication application, User employer) {
        String subject = String.format("Application Status Update - %s at %s", 
            application.getJob().getTitle(), 
            application.getJob().getCompany());
    
        String statusMessage;
        switch (application.getStatus()) {
            case REVIEWING:
                statusMessage = String.format(
                    "Your application for %s position at %s is now under review by our team.\n\n" +
                    "We are carefully evaluating your qualifications and experience. " +
                    "We appreciate your patience during this process.",
                    application.getJob().getTitle(),
                    application.getJob().getCompany()
                );
                break;
    
            case SHORTLISTED:
                statusMessage = String.format(
                    "Congratulations! You have been shortlisted for the %s position at %s.\n\n" +
                    "Your application has impressed our team, and we would like to move forward " +
                    "with the next steps in the selection process. You will receive further " +
                    "information about the interview process soon.",
                    application.getJob().getTitle(),
                    application.getJob().getCompany()
                );
                break;
    
            case INTERVIEWED:
                statusMessage = String.format(
                    "Thank you for attending the interview for the %s position at %s.\n\n" +
                    "We appreciate the time you spent with us discussing the role. " +
                    "Our team is evaluating all candidates, and we will get back to you " +
                    "with our decision shortly.",
                    application.getJob().getTitle(),
                    application.getJob().getCompany()
                );
                break;
    
            case OFFERED:
                statusMessage = String.format(
                    "Congratulations! We are pleased to inform you that you have been selected " +
                    "for the %s position at %s.\n\n" +
                    "We will be sending you a formal offer letter shortly with all the details. " +
                    "We are excited about the possibility of you joining our team!",
                    application.getJob().getTitle(),
                    application.getJob().getCompany()
                );
                break;
    
            case ACCEPTED:
                statusMessage = String.format(
                    "Welcome to %s!\n\n" +
                    "We are thrilled that you have accepted our offer for the %s position. " +
                    "Our HR team will be in touch shortly with next steps and onboarding information.",
                    application.getJob().getCompany(),
                    application.getJob().getTitle()
                );
                break;
    
            case REJECTED:
                statusMessage = String.format(
                    "Thank you for your interest in the %s position at %s.\n\n" +
                    "After careful consideration, we regret to inform you that we have decided " +
                    "to move forward with other candidates whose qualifications more closely match " +
                    "our current needs. We appreciate the time and effort you invested in applying, " +
                    "and we encourage you to apply for future positions that match your qualifications.",
                    application.getJob().getTitle(),
                    application.getJob().getCompany()
                );
                break;
    
            default:
                statusMessage = String.format(
                    "Your application for the %s position at %s has been updated.\n\n" +
                    "Current status: %s",
                    application.getJob().getTitle(),
                    application.getJob().getCompany(),
                    application.getStatus()
                );
                break;
        }
    
        String feedbackSection = application.getFeedback() != null && !application.getFeedback().isEmpty()
            ? "\n\nFeedback from the employer:\n" + application.getFeedback()
            : "";
    
        String body = String.format(
            "Dear %s,\n\n%s%s\n\nBest regards,\n%s\n%s",
            application.getApplicant().getName(),
            statusMessage,
            feedbackSection,
            employer.getName(),
            application.getJob().getCompany()
        );
    
        emailService.sendEmail(application.getApplicant().getEmail(), subject, body);
    }
    
    public boolean canAccessFile(String fileName, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new EntityNotFoundException("User not found"));

        if (user.getRole() == Role.ADMIN) return true;

        return applicationRepository.findAll().stream()
            .anyMatch(app -> 
                (app.getResumeUrl().equals(fileName) && 
                (app.getApplicant().getId().equals(user.getId()) || 
                app.getJob().getEmployer().getId().equals(user.getId())))
            );
    }

    public List<JobApplication> getApplicantApplications(String userEmail) {
        User applicant = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new EntityNotFoundException("User not found"));
        return applicationRepository.findByApplicantOrderByAppliedDateDesc(applicant);
    }

    public List<JobApplication> getEmployerApplications(String employerEmail) {
        User employer = userRepository.findByEmail(employerEmail)
            .orElseThrow(() -> new EntityNotFoundException("Employer not found"));
        return applicationRepository.findByJobEmployerOrderByAppliedDateDesc(employer);
    }

    public List<JobApplication> getJobApplications(Long jobId, String userEmail) {
        Job job = jobRepository.findById(jobId)
            .orElseThrow(() -> new EntityNotFoundException("Job not found"));

        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new EntityNotFoundException("User not found"));

        if (!job.getEmployer().getId().equals(user.getId())) {
            throw new IllegalStateException("Not authorized to view these applications");
        }

        return applicationRepository.findByJobOrderByAppliedDateDesc(job);
    }

    public List<JobApplication> getApplicationsByUser(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new EntityNotFoundException("User not found"));
        return applicationRepository.findByApplicantOrderByAppliedDateDesc(user);
    }

    public JobApplication getApplicationById(Long id, String userEmail) {
        logger.info("Fetching application with id: {} for user: {}", id, userEmail);
        
        JobApplication application = applicationRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Application not found with id: " + id));

        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new EntityNotFoundException("User not found"));

        boolean isAuthorized = user.getRole() == Role.ADMIN ||
            application.getApplicant().getId().equals(user.getId()) ||
            application.getJob().getEmployer().getId().equals(user.getId());

        if (!isAuthorized) {
            throw new AccessDeniedException("Not authorized to view this application");
        }

        logger.info("Successfully retrieved application: {}", application.getId());
        return application;
    }

    public String getResumeUrl(Long applicationId, String userEmail) {
        JobApplication application = applicationRepository.findById(applicationId)
            .orElseThrow(() -> new EntityNotFoundException("Application not found"));

        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new EntityNotFoundException("User not found"));

        boolean isAuthorized = user.getRole() == Role.ADMIN ||
            application.getJob().getEmployer().getId().equals(user.getId()) ||
            application.getApplicant().getId().equals(user.getId());

        if (!isAuthorized) {
            throw new IllegalStateException("Not authorized to access this resume");
        }

        if (application.getResumeUrl() == null || application.getResumeUrl().isEmpty()) {
            throw new IllegalStateException("No resume found for this application");
        }

        return application.getResumeUrl();
    }
}