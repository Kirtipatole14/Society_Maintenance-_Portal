package com.society.maintenanceportal.controller;

import com.society.maintenanceportal.model.Complaint;
import com.society.maintenanceportal.model.ComplaintStatus;
import com.society.maintenanceportal.model.Maintenance;
import com.society.maintenanceportal.model.MaintenanceStatus;
import com.society.maintenanceportal.model.Notice;
import com.society.maintenanceportal.model.Payment;
import com.society.maintenanceportal.model.PaymentStatus;
import com.society.maintenanceportal.model.User;
import com.society.maintenanceportal.service.AuthService;
import com.society.maintenanceportal.service.ComplaintService;
import com.society.maintenanceportal.service.MaintenanceService;
import com.society.maintenanceportal.service.NoticeService;
import com.society.maintenanceportal.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/manager")
@CrossOrigin(origins = "http://localhost:3000")
public class ManagerController {
    @Autowired
    private NoticeService noticeService;

    @Autowired
    private ComplaintService complaintService;

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private MaintenanceService maintenanceService;

    @Autowired
    private AuthService authService;

    @PostMapping("/notices")
    public ResponseEntity<?> createNotice(@Valid @RequestBody Notice notice) {
        try {
            User manager = authService.getCurrentUser();
            Notice created = noticeService.createNotice(notice, manager);
            return ResponseEntity.ok(created);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/notices")
    public ResponseEntity<List<Notice>> getAllNotices() {
        return ResponseEntity.ok(noticeService.getAllNotices());
    }

    @DeleteMapping("/notices/{id}")
    public ResponseEntity<?> deleteNotice(@PathVariable Long id) {
        try {
            noticeService.deleteNotice(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/complaints")
    public ResponseEntity<List<Complaint>> getAllComplaints() {
        return ResponseEntity.ok(complaintService.getAllComplaints());
    }

    @PutMapping("/complaints/{id}/resolve")
    public ResponseEntity<?> resolveComplaint(@PathVariable Long id, @RequestParam String resolution) {
        try {
            User manager = authService.getCurrentUser();
            Complaint complaint = complaintService.resolveComplaint(id, resolution, manager);
            return ResponseEntity.ok(complaint);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/complaints/{id}/status")
    public ResponseEntity<?> updateComplaintStatus(@PathVariable Long id, @RequestParam ComplaintStatus status) {
        try {
            User manager = authService.getCurrentUser();
            Complaint complaint = complaintService.updateComplaintStatus(id, status, manager);
            return ResponseEntity.ok(complaint);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/payments")
    public ResponseEntity<List<Payment>> getAllPayments() {
        return ResponseEntity.ok(paymentService.getAllPayments());
    }

    @PutMapping("/payments/{id}/approve")
    public ResponseEntity<?> approvePayment(@PathVariable Long id, @RequestParam(required = false) String remarks) {
        try {
            User manager = authService.getCurrentUser();
            Payment payment = paymentService.approvePayment(id, remarks, manager);
            return ResponseEntity.ok(payment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/payments/{id}/reject")
    public ResponseEntity<?> rejectPayment(@PathVariable Long id, @RequestParam(required = false) String remarks) {
        try {
            User manager = authService.getCurrentUser();
            Payment payment = paymentService.rejectPayment(id, remarks, manager);
            return ResponseEntity.ok(payment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/maintenance")
    public ResponseEntity<List<Maintenance>> getAllMaintenance() {
        return ResponseEntity.ok(maintenanceService.getAllMaintenance());
    }

    @PutMapping("/maintenance/{id}/status")
    public ResponseEntity<?> updateMaintenanceStatus(@PathVariable Long id, @RequestParam MaintenanceStatus status) {
        try {
            User manager = authService.getCurrentUser();
            Maintenance maintenance = maintenanceService.updateMaintenanceStatus(id, status, manager);
            return ResponseEntity.ok(maintenance);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}

