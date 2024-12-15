// src/main/java/com/jobportal/service/AuthService.java
package com.jobportal.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.jobportal.config.JwtTokenProvider;
import com.jobportal.dto.ForgotPasswordRequest;
import com.jobportal.dto.LoginRequest;
import com.jobportal.dto.RegisterRequest;
import com.jobportal.dto.ResetPasswordRequest;
import com.jobportal.model.Role;
import com.jobportal.model.User;
import com.jobportal.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtTokenProvider tokenProvider;
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private EmailService emailService;
    
    public ResponseEntity<?> register(RegisterRequest request) {
        try {
            if (userRepository.findByEmail(request.getEmail()).isPresent()) {
                return ResponseEntity.badRequest().body("Email already exists");
            }
            
            User user = new User();
            user.setName(request.getName());
            user.setEmail(request.getEmail());
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            
            try {
                Role userRole = Role.valueOf(request.getRole().toUpperCase());
                user.setRole(userRole);
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body("Invalid role specified");
            }
            
            User savedUser = userRepository.save(user);
            
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
            
            String token = tokenProvider.generateToken(authentication);
            
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("id", savedUser.getId());
            response.put("name", savedUser.getName());
            response.put("email", savedUser.getEmail());
            response.put("role", savedUser.getRole().toString());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Registration failed: " + e.getMessage());
        }
    }
    
    public ResponseEntity<?> login(LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
            
            SecurityContextHolder.getContext().setAuthentication(authentication);
            
            Optional<User> userOptional = userRepository.findByEmail(request.getEmail());
            if (!userOptional.isPresent()) {
                throw new RuntimeException("User not found");
            }
            
            User user = userOptional.get();
            String token = tokenProvider.generateToken(authentication);
            
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("id", user.getId());
            response.put("name", user.getName());
            response.put("email", user.getEmail());
            response.put("role", user.getRole().toString());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid credentials");
        }
    }
    
    public ResponseEntity<?> forgotPassword(ForgotPasswordRequest request) {
        try {
            Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
            if (!userOpt.isPresent()) {
                return ResponseEntity.badRequest().body("User not found");
            }
            
            User user = userOpt.get();
            String token = UUID.randomUUID().toString();
            user.setResetToken(token);
            user.setResetTokenExpiry(LocalDateTime.now().plusHours(24));
            userRepository.save(user);
            
            String resetLink = "http://localhost:3000/reset-password?token=" + token;
            emailService.sendResetPasswordEmail(user.getEmail(), resetLink);
            
            return ResponseEntity.ok("Password reset email sent");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to process password reset request");
        }
    }
    
    public ResponseEntity<?> resetPassword(ResetPasswordRequest request) {
        try {
            Optional<User> userOpt = userRepository.findByResetToken(request.getToken());
            if (!userOpt.isPresent()) {
                return ResponseEntity.badRequest().body("Invalid token");
            }
            
            User user = userOpt.get();
            if (LocalDateTime.now().isAfter(user.getResetTokenExpiry())) {
                return ResponseEntity.badRequest().body("Token expired");
            }
            
            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
            user.setResetToken(null);
            user.setResetTokenExpiry(null);
            userRepository.save(user);
            
            return ResponseEntity.ok("Password reset successful");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to reset password");
        }
    }
}