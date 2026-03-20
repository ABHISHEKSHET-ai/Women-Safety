package com.example.womensafetyq.repository;

import com.example.womensafetyq.entity.UnsafeArea;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UnsafeAreaRepository extends JpaRepository<UnsafeArea, Long> {

    List<UnsafeArea> findByStatusOrderByCreatedAtDesc(UnsafeArea.ReportStatus status);

    List<UnsafeArea> findByStatus(UnsafeArea.ReportStatus status);

    long countByStatus(UnsafeArea.ReportStatus status);
}
