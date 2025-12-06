package com.society.maintenanceportal.repository;

import com.society.maintenanceportal.model.Maintenance;
import com.society.maintenanceportal.model.MaintenanceStatus;
import com.society.maintenanceportal.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MaintenanceRepository extends JpaRepository<Maintenance, Long> {
    List<Maintenance> findByResidentOrderByCreatedAtDesc(User resident);
    List<Maintenance> findByStatusOrderByCreatedAtDesc(MaintenanceStatus status);
    List<Maintenance> findAllByOrderByCreatedAtDesc();
}

