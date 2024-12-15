package com.jobportal.mapper;

import com.jobportal.dto.UserResponse;
import com.jobportal.model.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {
    
    public UserResponse toResponse(User user) {
        if (user == null) {
            return null;
        }

        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole());
        // Map additional fields as needed
        
        return response;
    }
}