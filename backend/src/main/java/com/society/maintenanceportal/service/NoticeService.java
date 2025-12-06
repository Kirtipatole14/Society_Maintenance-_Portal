package com.society.maintenanceportal.service;

import com.society.maintenanceportal.model.Notice;
import com.society.maintenanceportal.model.User;
import com.society.maintenanceportal.repository.NoticeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NoticeService {
    @Autowired
    private NoticeRepository noticeRepository;

    public Notice createNotice(Notice notice, User manager) {
        notice.setManager(manager);
        return noticeRepository.save(notice);
    }

    public List<Notice> getAllNotices() {
        return noticeRepository.findAllByOrderByCreatedAtDesc();
    }

    public Notice getNoticeById(Long id) {
        return noticeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notice not found"));
    }

    public void deleteNotice(Long id) {
        noticeRepository.deleteById(id);
    }
}

