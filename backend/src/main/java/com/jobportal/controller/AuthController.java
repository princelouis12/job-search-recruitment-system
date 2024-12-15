package com.jobportal.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.jobportal.dto.ForgotPasswordRequest;
import com.jobportal.dto.LoginRequest;
import com.jobportal.dto.RegisterRequest;
import com.jobportal.dto.ResetPasswordRequest;
import com.jobportal.service.AuthService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    
    @Autowired
    private AuthService authService;
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        logger.info("Received registration request for email: {}", request.getEmail());
        try {
            return authService.register(request);
        } catch (Exception e) {
            logger.error("Registration failed: ", e);
            return ResponseEntity.badRequest().body("Registration failed: " + e.getMessage());
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        logger.info("Received login request for email: {}", request.getEmail());
        try {
            return authService.login(request);
        } catch (Exception e) {
            logger.error("Login failed: ", e);
            return ResponseEntity.badRequest().body("Login failed: " + e.getMessage());
        }
    }
    
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        return authService.forgotPassword(request);
    }
    
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        return authService.resetPassword(request);
    }
}