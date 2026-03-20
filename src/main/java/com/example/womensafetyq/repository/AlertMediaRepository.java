package com.example.womensafetyq.repository;

import com.example.womensafetyq.entity.AlertMedia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlertMediaRepository extends JpaRepository<AlertMedia, Long> {

    List<AlertMedia> findByAlertId(Long alertId);
}
