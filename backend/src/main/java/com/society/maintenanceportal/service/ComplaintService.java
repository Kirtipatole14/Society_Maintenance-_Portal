package com.society.maintenanceportal.service;

import com.society.maintenanceportal.model.Complaint;
import com.society.maintenanceportal.model.ComplaintStatus;
import com.society.maintenanceportal.model.User;
import com.society.maintenanceportal.repository.ComplaintRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ComplaintService {
    @Autowired
    private ComplaintRepository complaintRepository;

    public Complaint createComplaint(Complaint complaint, User resident) {
        complaint.setResident(resident);
        complaint.setStatus(ComplaintStatus.PENDING);
        return complaintRepository.save(complaint);
    }

    public List<Complaint> getComplaintsByResident(User resident) {
        return complaintRepository.findByResidentOrderByCreatedAtDesc(resident);
    }

    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<Complaint> getComplaintsByStatus(ComplaintStatus status) {
        return complaintRepository.findByStatusOrderByCreatedAtDesc(status);
    }

    public Complaint resolveComplaint(Long id, String resolution, User manager) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));
        complaint.setResolution(resolution);
        complaint.setStatus(ComplaintStatus.RESOLVED);
        complaint.setManager(manager);
        complaint.setResolvedAt(LocalDateTime.now());
        return complaintRepository.save(complaint);
    }

    public Complaint updateComplaintStatus(Long id, ComplaintStatus status, User manager) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));
        complaint.setStatus(status);
        complaint.setManager(manager);
        if (status == ComplaintStatus.RESOLVED) {
            complaint.setResolvedAt(LocalDateTime.now());
        }
        return complaintRepository.save(complaint);
    }
}

