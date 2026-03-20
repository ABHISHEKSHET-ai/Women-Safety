package com.example.womensafetyq.controller;

import com.example.womensafetyq.dto.PanicAlertRequest;
import com.example.womensafetyq.entity.Alert;
import com.example.womensafetyq.entity.AlertMedia;
import com.example.womensafetyq.entity.LocationTracking;
import com.example.womensafetyq.service.AlertService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/alerts")
public class AlertController {

    @Autowired
    private AlertService alertService;

    @PostMapping("/panic")
    public ResponseEntity<Alert> createPanicAlert(
            Authentication authentication,
            @Valid @RequestBody PanicAlertRequest request) {
        Long userId = Long.parseLong(authentication.getPrincipal().toString());
        Alert alert = alertService.createPanicAlert(userId, request);
        return ResponseEntity.ok(alert);
    }

    @GetMapping("/history")
    public ResponseEntity<List<Alert>> getAlertHistory(Authentication authentication) {
        Long userId = Long.parseLong(authentication.getPrincipal().toString());
        List<Alert> alerts = alertService.getUserAlerts(userId);
        return ResponseEntity.ok(alerts);
    }

    @GetMapping("/{alertId}")
    public ResponseEntity<Alert> getAlertById(@PathVariable Long alertId) {
        Alert alert = alertService.getAlertById(alertId);
        return ResponseEntity.ok(alert);
    }

    @PostMapping("/{alertId}/location")
    public ResponseEntity<LocationTracking> addLocationTracking(
            @PathVariable Long alertId,
            @RequestParam Double latitude,
            @RequestParam Double longitude,
            @RequestParam(required = false) String address) {
        LocationTracking tracking = alertService.addLocationTracking(alertId, latitude, longitude, address);
        return ResponseEntity.ok(tracking);
    }

    @GetMapping("/{alertId}/location-history")
    public ResponseEntity<List<LocationTracking>> getLocationHistory(@PathVariable Long alertId) {
        List<LocationTracking> history = alertService.getAlertLocationHistory(alertId);
        return ResponseEntity.ok(history);
    }

    @PutMapping("/{alertId}/cancel")
    public ResponseEntity<Alert> cancelAlert(
            Authentication authentication,
            @PathVariable Long alertId) {
        Long userId = Long.parseLong(authentication.getPrincipal().toString());
        Alert alert = alertService.cancelAlert(alertId, userId);
        return ResponseEntity.ok(alert);
    }

    @PostMapping("/{alertId}/media")
    public ResponseEntity<Map<String, Object>> uploadAlertMedia(
            Authentication authentication,
            @PathVariable Long alertId,
            @RequestParam(value = "photos", required = false) List<MultipartFile> photos,
            @RequestParam(value = "audio", required = false) MultipartFile audio) {
        try {
            Long userId = Long.parseLong(authentication.getPrincipal().toString());
            alertService.saveAlertMedia(alertId, userId, photos, audio);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Media uploaded successfully");
            response.put("photoCount", photos != null ? photos.size() : 0);
            response.put("audioUploaded", audio != null && !audio.isEmpty());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to upload media: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    // Get all evidence for current user
    @GetMapping("/evidence/all")
    public ResponseEntity<List<Map<String, Object>>> getAllEvidence(Authentication authentication) {
        Long userId = Long.parseLong(authentication.getPrincipal().toString());
        List<Map<String, Object>> evidence = alertService.getAllUserEvidence(userId);
        return ResponseEntity.ok(evidence);
    }

    // Get evidence by ID
    @GetMapping("/evidence/{evidenceId}")
    public ResponseEntity<AlertMedia> getEvidenceById(@PathVariable Long evidenceId) {
        AlertMedia evidence = alertService.getEvidenceById(evidenceId);
        return ResponseEntity.ok(evidence);
    }

    // View evidence file
    @GetMapping("/evidence/{evidenceId}/view")
    public ResponseEntity<Resource> viewEvidence(@PathVariable Long evidenceId) {
        try {
            AlertMedia evidence = alertService.getEvidenceById(evidenceId);
            Path filePath = Paths.get(evidence.getFilePath());
            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists()) {
                return ResponseEntity.notFound().build();
            }

            String contentType = "application/octet-stream";
            if (evidence.getMediaType() == AlertMedia.MediaType.IMAGE) {
                contentType = "image/jpeg";
            } else if (evidence.getMediaType() == AlertMedia.MediaType.AUDIO) {
                contentType = "audio/webm";
            } else if (evidence.getMediaType() == AlertMedia.MediaType.VIDEO) {
                contentType = "video/webm";
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + evidence.getFileName() + "\"")
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Download evidence file
    @GetMapping("/evidence/{evidenceId}/download")
    public ResponseEntity<Resource> downloadEvidence(@PathVariable Long evidenceId) {
        try {
            AlertMedia evidence = alertService.getEvidenceById(evidenceId);
            Path filePath = Paths.get(evidence.getFilePath());
            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists()) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + evidence.getFileName() + "\"")
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Get evidence by alert ID
    @GetMapping("/{alertId}/evidence")
    public ResponseEntity<List<AlertMedia>> getAlertEvidence(@PathVariable Long alertId) {
        List<AlertMedia> evidence = alertService.getAlertEvidence(alertId);
        return ResponseEntity.ok(evidence);
    }
}
