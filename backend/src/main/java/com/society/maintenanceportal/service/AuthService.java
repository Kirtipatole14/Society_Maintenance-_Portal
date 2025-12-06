package com.society.maintenanceportal.service;

import com.society.maintenanceportal.dto.ForgotPasswordRequest;
import com.society.maintenanceportal.dto.JwtAuthenticationResponse;
import com.society.maintenanceportal.dto.LoginRequest;
import com.society.maintenanceportal.dto.RegisterRequest;
import com.society.maintenanceportal.dto.ResetPasswordRequest;
import com.society.maintenanceportal.model.Role;
import com.society.maintenanceportal.model.User;
import com.society.maintenanceportal.model.UserStatus;
import com.society.maintenanceportal.repository.UserRepository;
import com.society.maintenanceportal.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private AuthenticationManager authenticationManager;

    public JwtAuthenticationResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username is already taken!");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already in use!");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setName(request.getName());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setAddress(request.getAddress());
        user.setFlatNumber(request.getFlatNumber());

        // Admin is auto-approved, others need approval
        if (request.getRole() == Role.ADMIN) {
            user.setStatus(UserStatus.APPROVED);
        } else {
            user.setStatus(UserStatus.PENDING);
        }
        user.setRole(request.getRole());

        userRepository.save(user);

        String token = tokenProvider.generateToken(user.getUsername(), user.getRole().name());
        return new JwtAuthenticationResponse(token, user.getRole().name(), user.getUsername());
    }

    public JwtAuthenticationResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getStatus() != UserStatus.APPROVED) {
            throw new RuntimeException("Your account is pending approval. Please wait for admin approval.");
        }

        String token = tokenProvider.generateToken(user.getUsername(), user.getRole().name());
        return new JwtAuthenticationResponse(token, user.getRole().name(), user.getUsername());
    }

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public String forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User with this email does not exist"));

        // Generate reset token
        String resetToken = UUID.randomUUID().toString();
        user.setResetToken(resetToken);
        user.setResetTokenExpiry(LocalDateTime.now().plusHours(1)); // Token valid for 1 hour
        userRepository.save(user);

        // In a real application, you would send this token via email
        // For now, we'll return it (in production, return a success message)
        return resetToken;
    }

    public void resetPassword(ResetPasswordRequest request) {
        User user = userRepository.findByResetToken(request.getToken())
                .orElseThrow(() -> new RuntimeException("Invalid or expired reset token"));

        if (user.getResetTokenExpiry() == null || user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Reset token has expired. Please request a new one.");
        }

        // Update password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);
    }
}

