package com.jobportal.service;

import com.jobportal.model.*;
import com.jobportal.repository.*;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class ApplicationStatusService {

    @Autowired
    private JobApplicationRepository applicationRepository;

    @Autowired
    private EmailService emailService;

    // Define valid status transitions
    private static final Map<ApplicationStatus, Set<ApplicationStatus>> VALID_TRANSITIONS;
    
    static {
        VALID_TRANSITIONS = new EnumMap<>(ApplicationStatus.class);
        
        // Using HashSet instead of Set.of() for Java compatibility
        Set<ApplicationStatus> pendingTransitions = new HashSet<>();
        pendingTransitions.add(ApplicationStatus.REVIEWING);
        pendingTransitions.add(ApplicationStatus.REJECTED);
        VALID_TRANSITIONS.put(ApplicationStatus.PENDING, pendingTransitions);

        Set<ApplicationStatus> reviewingTransitions = new HashSet<>();
        reviewingTransitions.add(ApplicationStatus.SHORTLISTED);
        reviewingTransitions.add(ApplicationStatus.REJECTED);
        VALID_TRANSITIONS.put(ApplicationStatus.REVIEWING, reviewingTransitions);

        Set<ApplicationStatus> shortlistedTransitions = new HashSet<>();
        shortlistedTransitions.add(ApplicationStatus.INTERVIEWED);
        shortlistedTransitions.add(ApplicationStatus.REJECTED);
        VALID_TRANSITIONS.put(ApplicationStatus.SHORTLISTED, shortlistedTransitions);

        Set<ApplicationStatus> interviewedTransitions = new HashSet<>();
        interviewedTransitions.add(ApplicationStatus.OFFERED);
        interviewedTransitions.add(ApplicationStatus.REJECTED);
        VALID_TRANSITIONS.put(ApplicationStatus.INTERVIEWED, interviewedTransitions);

        Set<ApplicationStatus> offeredTransitions = new HashSet<>();
        offeredTransitions.add(ApplicationStatus.ACCEPTED);
        offeredTransitions.add(ApplicationStatus.REJECTED);
        VALID_TRANSITIONS.put(ApplicationStatus.OFFERED, offeredTransitions);

        // Terminal states
        VALID_TRANSITIONS.put(ApplicationStatus.ACCEPTED, new HashSet<>());
        VALID_TRANSITIONS.put(ApplicationStatus.REJECTED, new HashSet<>());
    }

    @Transactional
    public JobApplication updateApplicationStatus(Long applicationId, ApplicationStatus newStatus, String feedback, String employerEmail) {
        JobApplication application = applicationRepository.findById(applicationId)
            .orElseThrow(() -> new EntityNotFoundException("Application not found"));

        // Validate status transition
        if (!isValidStatusTransition(application.getStatus(), newStatus)) {
            throw new IllegalStateException(
                String.format("Invalid status transition from %s to %s", 
                    application.getStatus(), newStatus)
            );
        }

        // Validate feedback requirement
        if (requiresFeedback(newStatus) && (feedback == null || feedback.trim().isEmpty())) {
            throw new IllegalArgumentException("Feedback is required for this status change");
        }

        // Update application status
        application.setStatus(newStatus);
        if (feedback != null && !feedback.trim().isEmpty()) {
            application.setFeedback(feedback);
        }

        // Save the updated application
        application = applicationRepository.save(application);

        // Send appropriate notifications
        sendStatusUpdateNotification(application);

        return application;
    }

    private boolean isValidStatusTransition(ApplicationStatus currentStatus, ApplicationStatus newStatus) {
        Set<ApplicationStatus> validNextStates = VALID_TRANSITIONS.get(currentStatus);
        return validNextStates != null && validNextStates.contains(newStatus);
    }

    private boolean requiresFeedback(ApplicationStatus status) {
        return status == ApplicationStatus.REJECTED || 
               status == ApplicationStatus.REVIEWING ||
               status == ApplicationStatus.SHORTLISTED ||
               status == ApplicationStatus.INTERVIEWED ||
               status == ApplicationStatus.OFFERED;
    }

    private void sendStatusUpdateNotification(JobApplication application) {
        String applicantEmail = application.getApplicant().getEmail();
        String jobTitle = application.getJob().getTitle();
        String companyName = application.getJob().getCompany();
        
        String subject = String.format("Application Status Update - %s at %s", jobTitle, companyName);
        String message = buildStatusUpdateMessage(application);
        
        emailService.sendEmail(applicantEmail, subject, message);
    }

    private String buildStatusUpdateMessage(JobApplication application) {
        StringBuilder message = new StringBuilder();
        message.append(String.format("Dear %s,\n\n", application.getApplicant().getName()));
        message.append(String.format("Your application for the position of %s at %s has been updated.\n\n", 
            application.getJob().getTitle(), 
            application.getJob().getCompany()));
        
        message.append("Current Status: ").append(application.getStatus()).append("\n\n");
        
        if (application.getFeedback() != null && !application.getFeedback().isEmpty()) {
            message.append("Feedback:\n").append(application.getFeedback()).append("\n\n");
        }
        
        // Add next steps based on status
        message.append(getNextStepsMessage(application.getStatus()));
        
        message.append("\nBest regards,\n");
        message.append(application.getJob().getCompany()).append(" Recruitment Team");
        
        return message.toString();
    }

    

    private String getNextStepsMessage(ApplicationStatus status) {
        switch (status) {
            case REVIEWING:
                return "Your application is being reviewed by our team. We will update you on the next steps soon.";
            case SHORTLISTED:
                return "Congratulations! You have been shortlisted. Our team will contact you soon to schedule an interview.";
            case INTERVIEWED:
                return "Thank you for attending the interview. We will evaluate your performance and get back to you soon.";
            case OFFERED:
                return "Congratulations! We would like to extend you an offer. Please check your email for offer details.";
            case ACCEPTED:
                return "Welcome aboard! Our HR team will contact you shortly with onboarding details.";
            case REJECTED:
                return "We appreciate your interest and wish you the best in your job search.";
            default:
                return "We will keep you updated on any changes to your application status.";
        }
    }
}