package com.society.maintenanceportal.repository;

import com.society.maintenanceportal.model.Role;
import com.society.maintenanceportal.model.User;
import com.society.maintenanceportal.model.UserStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    List<User> findByRole(Role role);
    List<User> findByRoleAndStatus(Role role, UserStatus status);
    List<User> findByStatus(UserStatus status);
    Optional<User> findByResetToken(String resetToken);
}

