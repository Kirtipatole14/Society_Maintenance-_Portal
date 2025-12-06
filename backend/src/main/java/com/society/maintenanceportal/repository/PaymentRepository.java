package com.society.maintenanceportal.repository;

import com.society.maintenanceportal.model.Payment;
import com.society.maintenanceportal.model.PaymentStatus;
import com.society.maintenanceportal.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByResidentOrderByCreatedAtDesc(User resident);
    List<Payment> findByStatusOrderByCreatedAtDesc(PaymentStatus status);
    List<Payment> findAllByOrderByCreatedAtDesc();
}

