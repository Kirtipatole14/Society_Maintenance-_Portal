package com.society.maintenanceportal.service;

import com.society.maintenanceportal.model.Payment;
import com.society.maintenanceportal.model.PaymentStatus;
import com.society.maintenanceportal.model.User;
import com.society.maintenanceportal.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PaymentService {
    @Autowired
    private PaymentRepository paymentRepository;

    public Payment createPayment(Payment payment, User resident) {
        payment.setResident(resident);
        payment.setStatus(PaymentStatus.PENDING);
        return paymentRepository.save(payment);
    }

    public List<Payment> getPaymentsByResident(User resident) {
        return paymentRepository.findByResidentOrderByCreatedAtDesc(resident);
    }

    public List<Payment> getAllPayments() {
        return paymentRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<Payment> getPaymentsByStatus(PaymentStatus status) {
        return paymentRepository.findByStatusOrderByCreatedAtDesc(status);
    }

    public Payment approvePayment(Long id, String remarks, User manager) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
        payment.setStatus(PaymentStatus.APPROVED);
        payment.setManager(manager);
        payment.setRemarks(remarks);
        payment.setApprovedAt(LocalDateTime.now());
        return paymentRepository.save(payment);
    }

    public Payment rejectPayment(Long id, String remarks, User manager) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
        payment.setStatus(PaymentStatus.REJECTED);
        payment.setManager(manager);
        payment.setRemarks(remarks);
        return paymentRepository.save(payment);
    }
}

