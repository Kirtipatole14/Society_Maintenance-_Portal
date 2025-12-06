package com.society.maintenanceportal.service;

import com.society.maintenanceportal.model.Maintenance;
import com.society.maintenanceportal.model.MaintenanceStatus;
import com.society.maintenanceportal.model.User;
import com.society.maintenanceportal.repository.MaintenanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MaintenanceService {
    @Autowired
    private MaintenanceRepository maintenanceRepository;

    public List<Maintenance> getMaintenanceByResident(User resident) {
        return maintenanceRepository.findByResidentOrderByCreatedAtDesc(resident);
    }

    public List<Maintenance> getAllMaintenance() {
        return maintenanceRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<Maintenance> getMaintenanceByStatus(MaintenanceStatus status) {
        return maintenanceRepository.findByStatusOrderByCreatedAtDesc(status);
    }

    public Maintenance updateMaintenanceStatus(Long id, MaintenanceStatus status, User manager) {
        Maintenance maintenance = maintenanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Maintenance record not found"));
        maintenance.setStatus(status);
        maintenance.setManager(manager);
        return maintenanceRepository.save(maintenance);
    }

    public Maintenance getMaintenanceById(Long id) {
        return maintenanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Maintenance record not found"));
    }
}

