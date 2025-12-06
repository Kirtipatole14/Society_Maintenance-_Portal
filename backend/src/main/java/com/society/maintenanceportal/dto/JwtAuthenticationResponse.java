package com.society.maintenanceportal.dto;

public class JwtAuthenticationResponse {
    private String token;
    private String tokenType = "Bearer";
    private String role;
    private String username;

    public JwtAuthenticationResponse() {}

    public JwtAuthenticationResponse(String token, String role, String username) {
        this.token = token;
        this.role = role;
        this.username = username;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getTokenType() {
        return tokenType;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}

