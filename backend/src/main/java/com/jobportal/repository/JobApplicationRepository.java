package com.jobportal.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.jobportal.model.JobApplication;
import com.jobportal.model.Job;
import com.jobportal.model.User;
import com.jobportal.model.ApplicationStatus;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {
    // Existing methods
    List<JobApplication> findByApplicantOrderByAppliedDateDesc(User applicant);
    List<JobApplication> findByJobEmployerOrderByAppliedDateDesc(User employer);
    
    @Query("SELECT CASE WHEN COUNT(ja) > 0 THEN true ELSE false END FROM JobApplication ja " +
           "WHERE ja.job = :job AND ja.applicant = :applicant")
    boolean existsByJobAndApplicant(@Param("job") Job job, @Param("applicant") User applicant);
    
    @Query("SELECT ja FROM JobApplication ja WHERE ja.job = :job ORDER BY ja.appliedDate DESC")
    List<JobApplication> findByJobOrderByAppliedDateDesc(@Param("job") Job job);
    
    // Added methods for dashboard
    @Query("SELECT COUNT(ja) FROM JobApplication ja WHERE ja.appliedDate >= :date")
    long countByAppliedDateAfter(@Param("date") LocalDateTime date);
    
    @Query("SELECT COUNT(ja) FROM JobApplication ja WHERE ja.applicant = :applicant")
    long countByApplicant(@Param("applicant") User applicant);
    
    @Query("SELECT COUNT(ja) FROM JobApplication ja WHERE ja.applicant = :applicant AND ja.status = :status")
    long countByApplicantAndStatus(@Param("applicant") User applicant, @Param("status") ApplicationStatus status);
    
    @Query("SELECT COUNT(ja) FROM JobApplication ja WHERE ja.job.employer = :employer")
    long countByJobEmployer(@Param("employer") User employer);
    
    @Query("SELECT COUNT(ja) FROM JobApplication ja WHERE ja.job.employer = :employer AND ja.status = :status")
    long countByJobEmployerAndStatus(@Param("employer") User employer, @Param("status") ApplicationStatus status);
    
    @Query("SELECT ja FROM JobApplication ja WHERE ja.job.employer = :employer ORDER BY ja.appliedDate DESC")
    List<JobApplication> findTop10ByJobEmployerOrderByAppliedDateDesc(@Param("employer") User employer);
}