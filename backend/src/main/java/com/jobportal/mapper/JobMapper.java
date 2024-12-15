package com.jobportal.mapper;

import com.jobportal.dto.JobResponse;
import com.jobportal.model.Job;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class JobMapper {
    
    @Autowired
    private UserMapper userMapper;

    public JobResponse toResponse(Job job) {
        if (job == null) {
            return null;
        }

        JobResponse response = new JobResponse();
        response.setId(job.getId());
        response.setTitle(job.getTitle());
        response.setDescription(job.getDescription());
        response.setCompany(job.getCompany());
        response.setLocation(job.getLocation());
        response.setType(job.getType());
        response.setSalary(job.getSalary());
        response.setRequirements(job.getRequirements());
        response.setSkills(job.getSkills());
        response.setEmployer(userMapper.toResponse(job.getEmployer()));
        response.setPostedDate(job.getPostedDate());
        response.setDeadline(job.getDeadline());
        response.setActive(job.isActive());
        response.setTotalApplications(job.getApplications().size());
        
        return response;
    }
}