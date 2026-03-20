package com.example.womensafetyq.service;

import com.example.womensafetyq.dto.UnsafeAreaRequest;
import com.example.womensafetyq.entity.UnsafeArea;
import com.example.womensafetyq.entity.User;
import com.example.womensafetyq.repository.UnsafeAreaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class UnsafeAreaService {

    @Autowired
    private UnsafeAreaRepository unsafeAreaRepository;

    @Autowired
    private UserService userService;

    public UnsafeArea reportUnsafeArea(Long userId, UnsafeAreaRequest request) {
        User user = userService.getUserById(userId);

        UnsafeArea area = new UnsafeArea();
        area.setUser(user);
        area.setLatitude(request.getLatitude());
        area.setLongitude(request.getLongitude());
        area.setLocation(request.getLocation());
        area.setDescription(request.getDescription());
        area.setRiskLevel(UnsafeArea.RiskLevel.valueOf(request.getRiskLevel()));
        area.setStatus(UnsafeArea.ReportStatus.PENDING);

        return unsafeAreaRepository.save(area);
    }

    public List<UnsafeArea> getAllApprovedAreas() {
        return unsafeAreaRepository.findByStatus(UnsafeArea.ReportStatus.APPROVED);
    }

    // Get all unsafe areas (approved and pending) for all users to see
    public List<UnsafeArea> getAllAreas() {
        return unsafeAreaRepository.findAll();
    }

    public List<UnsafeArea> getPendingReports() {
        return unsafeAreaRepository.findByStatusOrderByCreatedAtDesc(UnsafeArea.ReportStatus.PENDING);
    }

    public UnsafeArea updateReportStatus(Long reportId, UnsafeArea.ReportStatus status) {
        UnsafeArea area = unsafeAreaRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found"));

        area.setStatus(status);
        area.setUpdatedAt(LocalDateTime.now());

        return unsafeAreaRepository.save(area);
    }

    public long getPendingReportCount() {
        return unsafeAreaRepository.countByStatus(UnsafeArea.ReportStatus.PENDING);
    }
}
