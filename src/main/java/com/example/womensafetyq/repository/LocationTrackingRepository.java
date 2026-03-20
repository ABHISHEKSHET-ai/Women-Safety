package com.example.womensafetyq.repository;

import com.example.womensafetyq.entity.LocationTracking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LocationTrackingRepository extends JpaRepository<LocationTracking, Long> {

    List<LocationTracking> findByAlertIdOrderByTrackedAtDesc(Long alertId);
}
