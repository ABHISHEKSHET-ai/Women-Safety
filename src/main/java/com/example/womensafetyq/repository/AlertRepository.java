package com.example.womensafetyq.repository;

import com.example.womensafetyq.entity.Alert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlertRepository extends JpaRepository<Alert, Long> {

    List<Alert> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<Alert> findByIsActiveTrueOrderByCreatedAtDesc();

    List<Alert> findByStatusOrderByCreatedAtDesc(Alert.AlertStatus status);

    long countByIsActiveTrue();
}
