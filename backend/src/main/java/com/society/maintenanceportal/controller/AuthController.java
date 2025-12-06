package com.society.maintenanceportal.controller;

import com.society.maintenanceportal.dto.ForgotPasswordRequest;
import com.society.maintenanceportal.dto.JwtAuthenticationResponse;
import com.society.maintenanceportal.dto.LoginRequest;
import com.society.maintenanceportal.dto.RegisterRequest;
import com.society.maintenanceportal.dto.ResetPasswordRequest;
import com.society.maintenanceportal.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {
    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            JwtAuthenticationResponse response = authService.register(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            JwtAuthenticationResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        try {
            String resetToken = authService.forgotPassword(request);
            // In production, send token via email. For now, return it in response
            return ResponseEntity.ok(new java.util.HashMap<String, String>() {{
                put("message", "Password reset token generated. Check your email or use this token: " + resetToken);
                put("token", resetToken); // Remove this in production
            }});
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        try {
            authService.resetPassword(request);
            return ResponseEntity.ok(new java.util.HashMap<String, String>() {{
                put("message", "Password reset successfully. You can now login with your new password.");
            }});
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}

