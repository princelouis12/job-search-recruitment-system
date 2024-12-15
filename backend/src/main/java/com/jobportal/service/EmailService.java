// src/main/java/com/jobportal/service/EmailService.java
package com.jobportal.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class EmailService {
    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender mailSender;
    
    public void sendResetPasswordEmail(String to, String resetLink) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Password Reset Request");
        message.setText("To reset your password, click the following link: " + resetLink);
        mailSender.send(message);
    }

    public void sendEmail(String to, String subject, String content) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(content);
            mailSender.send(message);
            logger.info("Email sent successfully to: {}", to);
        } catch (Exception e) {
            logger.error("Failed to send email to: {}", to, e);
            throw new RuntimeException("Failed to send email", e);
        }
    }

    public void sendApplicationReceivedEmail(String to, String applicantName, String jobTitle, String companyName) {
        String subject = "Application Received - " + jobTitle;
        StringBuilder content = new StringBuilder();
        content.append("Dear ").append(applicantName).append(",\n\n");
        content.append("Thank you for applying for the position of ").append(jobTitle).append(" at ").append(companyName).append(". \n");
        content.append("We have received your application and will review it shortly.\n\n");
        content.append("We will contact you if your qualifications match our requirements.\n\n");
        content.append("Best regards,\n");
        content.append(companyName);
    
        sendEmail(to, subject, content.toString());
    }
    
    public void sendStatusUpdateEmail(String to, String applicantName, String jobTitle, String status, String feedback) {
        String subject = "Application Status Update - " + jobTitle;
        StringBuilder content = new StringBuilder();
        content.append("Dear ").append(applicantName).append(",\n\n");
        content.append("Your application for the position of ").append(jobTitle).append(" has been updated.\n");
        content.append("Current Status: ").append(status).append("\n\n");
        if (feedback != null) {
            content.append("Feedback: ").append(feedback).append("\n\n");
        }
        content.append("If you have any questions, please don't hesitate to contact us.\n\n");
        content.append("Best regards,");
    
        sendEmail(to, subject, content.toString());
    }
}