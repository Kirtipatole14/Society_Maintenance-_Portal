package com.society.maintenanceportal.service;

import com.society.maintenanceportal.model.Role;
import com.society.maintenanceportal.model.User;
import com.society.maintenanceportal.model.UserStatus;
import com.society.maintenanceportal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminService {
    @Autowired
    private UserRepository userRepository;

    public List<User> getPendingUsers() {
        return userRepository.findByStatus(UserStatus.PENDING);
    }

    public List<User> getAllResidents() {
        return userRepository.findByRole(Role.RESIDENT);
    }

    public List<User> getAllManagers() {
        return userRepository.findByRole(Role.MANAGER);
    }

    public User verifyUser(Long userId, UserStatus status) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setStatus(status);
        return userRepository.save(user);
    }
}

