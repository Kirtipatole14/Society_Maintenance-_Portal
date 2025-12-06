package com.society.maintenanceportal.controller;

import com.society.maintenanceportal.model.Complaint;
import com.society.maintenanceportal.model.Notice;
import com.society.maintenanceportal.model.Payment;
import com.society.maintenanceportal.model.User;
import com.society.maintenanceportal.service.AuthService;
import com.society.maintenanceportal.service.ComplaintService;
import com.society.maintenanceportal.service.NoticeService;
import com.society.maintenanceportal.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/resident")
@CrossOrigin(origins = "http://localhost:3000")
public class ResidentController {
    @Autowired
    private NoticeService noticeService;

    @Autowired
    private ComplaintService complaintService;

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private AuthService authService;

    @GetMapping("/notices")
    public ResponseEntity<List<Notice>> getNotices() {
        return ResponseEntity.ok(noticeService.getAllNotices());
    }

    @PostMapping("/complaints")
    public ResponseEntity<?> createComplaint(@Valid @RequestBody Complaint complaint) {
        try {
            User resident = authService.getCurrentUser();
            Complaint created = complaintService.createComplaint(complaint, resident);
            return ResponseEntity.ok(created);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/complaints")
    public ResponseEntity<List<Complaint>> getMyComplaints() {
        User resident = authService.getCurrentUser();
        return ResponseEntity.ok(complaintService.getComplaintsByResident(resident));
    }

    @PostMapping("/payments")
    public ResponseEntity<?> createPayment(@RequestParam BigDecimal amount) {
        try {
            User resident = authService.getCurrentUser();
            Payment payment = new Payment();
            payment.setAmount(amount);
            Payment created = paymentService.createPayment(payment, resident);
            return ResponseEntity.ok(created);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/payments")
    public ResponseEntity<List<Payment>> getMyPayments() {
        User resident = authService.getCurrentUser();
        return ResponseEntity.ok(paymentService.getPaymentsByResident(resident));
    }
}

