package com.jobportal.mapper;

import com.jobportal.dto.JobApplicationResponse;
import com.jobportal.model.JobApplication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class JobApplicationMapper {
    
    @Autowired
    private JobMapper jobMapper;
    
    @Autowired
    private UserMapper userMapper;

    public JobApplicationResponse toResponse(JobApplication application) {
        if (application == null) {
            return null;
        }

        JobApplicationResponse response = new JobApplicationResponse();
        response.setId(application.getId());
        response.setJob(jobMapper.toResponse(application.getJob()));
        response.setApplicant(userMapper.toResponse(application.getApplicant()));
        response.setCoverLetter(application.getCoverLetter());
        response.setResumeUrl(application.getResumeUrl());
        response.setAppliedDate(application.getAppliedDate());
        response.setStatus(application.getStatus());
        response.setFeedback(application.getFeedback());
        
        return response;
    }
}