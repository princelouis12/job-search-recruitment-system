package com.jobportal.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.jobportal.model.User;
import com.jobportal.model.Role;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // Basic queries
    Optional<User> findByEmail(String email);
    Optional<User> findByResetToken(String resetToken);
    
    // Dashboard statistics
    @Query(value = "SELECT DATE(created_date) as name, COUNT(*) as value " +
           "FROM users " +
           "WHERE created_date >= :startDate " +
           "GROUP BY DATE(created_date) " +
           "ORDER BY DATE(created_date)", 
           nativeQuery = true)
    List<Map<String, Object>> getUserActivityByDay(@Param("startDate") LocalDateTime startDate);

    @Query(value = "SELECT id, name as user, 'New Registration' as action, created_date as timestamp " +
           "FROM users " +
           "WHERE role = 'EMPLOYER' " +
           "ORDER BY created_date DESC " +
           "LIMIT 10", 
           nativeQuery = true)
    List<Map<String, Object>> getRecentActivities();
    
    // Role-based queries
    @Query("SELECT COUNT(u) FROM User u WHERE u.role = :role")
    long countByRole(@Param("role") Role role);
    
    @Query("SELECT u FROM User u WHERE u.role = :role ORDER BY u.createdDate DESC")
    List<User> findByRoleOrderByCreatedDateDesc(@Param("role") Role role);
    
    // Date-based queries
    @Query("SELECT COUNT(u) FROM User u WHERE u.createdDate >= :startDate")
    long countNewUsersAfter(@Param("startDate") LocalDateTime startDate);
    
    // Search queries
    @Query("SELECT u FROM User u WHERE u.role = :role AND " +
           "(LOWER(u.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    List<User> searchByRoleAndTerm(@Param("role") Role role, @Param("searchTerm") String searchTerm);
}