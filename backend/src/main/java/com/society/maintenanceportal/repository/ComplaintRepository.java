package com.society.maintenanceportal.repository;

import com.society.maintenanceportal.model.Complaint;
import com.society.maintenanceportal.model.ComplaintStatus;
import com.society.maintenanceportal.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    List<Complaint> findByResidentOrderByCreatedAtDesc(User resident);
    List<Complaint> findByStatusOrderByCreatedAtDesc(ComplaintStatus status);
    List<Complaint> findAllByOrderByCreatedAtDesc();
}

