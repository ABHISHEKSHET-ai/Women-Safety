package com.example.womensafetyq.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "alerts")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Alert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"alerts", "emergencyContacts", "reportedAreas", "password", "verificationCode", "resetToken", "resetTokenExpiry"})
    private User user;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    private String location;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AlertStatus status = AlertStatus.ACTIVE;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "alert_sent")
    private Boolean alertSent = false;

    @Column(name = "recording_started")
    private Boolean recordingStarted = false;

    @Column(name = "admin_verified")
    private Boolean adminVerified = false;

    @OneToMany(mappedBy = "alert", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<AlertMedia> mediaFiles = new ArrayList<>();

    @OneToMany(mappedBy = "alert", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<LocationTracking> locationTrackings = new ArrayList<>();

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    public enum AlertStatus {
        ACTIVE, RESOLVED, PENDING, VERIFIED, CLOSED, CANCELLED
    }
}
