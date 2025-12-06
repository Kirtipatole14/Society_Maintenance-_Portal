package com.society.maintenanceportal.controller;

import com.society.maintenanceportal.model.User;
import com.society.maintenanceportal.model.UserStatus;
import com.society.maintenanceportal.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {
    @Autowired
    private AdminService adminService;

    @GetMapping("/pending-users")
    public ResponseEntity<List<User>> getPendingUsers() {
        return ResponseEntity.ok(adminService.getPendingUsers());
    }

    @GetMapping("/residents")
    public ResponseEntity<List<User>> getAllResidents() {
        return ResponseEntity.ok(adminService.getAllResidents());
    }

    @GetMapping("/managers")
    public ResponseEntity<List<User>> getAllManagers() {
        return ResponseEntity.ok(adminService.getAllManagers());
    }

    @PutMapping("/verify-user/{userId}")
    public ResponseEntity<?> verifyUser(@PathVariable Long userId, @RequestParam UserStatus status) {
        try {
            User user = adminService.verifyUser(userId, status);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}

