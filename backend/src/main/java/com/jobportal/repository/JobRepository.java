package com.jobportal.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.jobportal.model.Job;
import com.jobportal.model.User;
import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {
    // Existing methods
    List<Job> findByEmployerId(Long employerId);
    List<Job> findByActiveTrue();
    List<Job> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String title, String description);
    
    // New methods for dashboard
    @Query("SELECT COUNT(j) FROM Job j WHERE j.active = true")
    long countByActiveTrue();
    
    @Query("SELECT COUNT(j) FROM Job j WHERE j.employer = :employer AND j.active = true")
    long countByEmployerAndActiveTrue(@Param("employer") User employer);
    
    @Query("SELECT j FROM Job j WHERE j.active = true ORDER BY j.postedDate DESC LIMIT 10")
    List<Job> findTop10ByActiveTrueOrderByPostedDateDesc();
    
    // Additional useful methods
    @Query("SELECT COUNT(j) FROM Job j WHERE j.employer = :employer")
    long countByEmployer(@Param("employer") User employer);
    
    @Query("SELECT j FROM Job j WHERE j.employer = :employer ORDER BY j.postedDate DESC")
    List<Job> findByEmployerOrderByPostedDateDesc(@Param("employer") User employer);
    
    @Query("SELECT j FROM Job j WHERE j.active = true AND j.deadline > CURRENT_TIMESTAMP")
    List<Job> findActiveJobsWithValidDeadline();
    
    @Query("SELECT j FROM Job j WHERE j.active = true AND " +
           "(:location IS NULL OR j.location LIKE %:location%) AND " +
           "(:type IS NULL OR j.type = :type)")
    List<Job> findJobsByLocationAndType(@Param("location") String location, @Param("type") String type);
}