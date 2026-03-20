package com.example.womensafetyq.service;

import com.example.womensafetyq.dto.PanicAlertRequest;
import com.example.womensafetyq.entity.*;
import com.example.womensafetyq.repository.AlertMediaRepository;
import com.example.womensafetyq.repository.AlertRepository;
import com.example.womensafetyq.repository.LocationTrackingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@Transactional
public class AlertService {

    @Autowired
    private AlertRepository alertRepository;

    @Autowired
    private LocationTrackingRepository locationTrackingRepository;

    @Autowired
    private AlertMediaRepository alertMediaRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private EmergencyContactService emergencyContactService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private SmsService smsService;

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    public Alert createPanicAlert(Long userId, PanicAlertRequest request) {
        User user = userService.getUserById(userId);

        Alert alert = new Alert();
        alert.setUser(user);
        alert.setLatitude(request.getLatitude());
        alert.setLongitude(request.getLongitude());
        alert.setLocation(request.getLocation());
        alert.setStatus(Alert.AlertStatus.ACTIVE);
        alert.setIsActive(true);
        alert.setAlertSent(false);
        alert.setRecordingStarted(false);

        alert = alertRepository.save(alert);

        // Send initial alert to emergency contacts via SMS/WhatsApp
        try {
            List<EmergencyContact> contacts = emergencyContactService.getUserContacts(userId);
            
            if (contacts.isEmpty()) {
                System.out.println("⚠️ No emergency contacts found for user: " + user.getName());
            } else {
                // Build initial alert message
                String message = String.format(
                        "🚨 EMERGENCY ALERT from %s!\n\n"
                        + "📍 Location: %s\n"
                        + "🕐 Time: %s\n\n"
                        + "🔴 Track live location:\n"
                        + "http://localhost:8080/location-tracking.html?alertId=%d\n\n"
                        + "This is an automated emergency alert. Please respond immediately!",
                        user.getName(),
                        request.getLocation(),
                        LocalDateTime.now(),
                        alert.getId()
                );

                System.out.println("\n📢 Sending emergency alerts to " + contacts.size() + " contacts...");
                
                for (EmergencyContact contact : contacts) {
                    try {
                        // Send SMS
                        smsService.sendSms(contact.getPhone(), message);
                        System.out.println("✅ SMS sent to " + contact.getName() + " (" + contact.getPhone() + ")");
                    } catch (Exception e) {
                        System.err.println("❌ Failed to send SMS to " + contact.getName() + ": " + e.getMessage());
                    }

                    try {
                        // Send WhatsApp
                        smsService.sendWhatsAppMessage(contact.getPhone(), message);
                        System.out.println("✅ WhatsApp sent to " + contact.getName() + " (" + contact.getPhone() + ")");
                    } catch (Exception e) {
                        System.err.println("❌ Failed to send WhatsApp to " + contact.getName() + ": " + e.getMessage());
                    }
                }
                
                System.out.println("✅ Emergency notifications sent to all contacts!\n");
            }
        } catch (Exception e) {
            System.err.println("❌ Failed to process emergency contacts: " + e.getMessage());
            e.printStackTrace();
        }

        alert.setAlertSent(true);
        alert = alertRepository.save(alert);

        // Create initial location tracking
        addLocationTracking(alert.getId(), request.getLatitude(), request.getLongitude(), request.getLocation());

        return alert;
    }

    public LocationTracking addLocationTracking(Long alertId, Double latitude, Double longitude, String address) {
        Alert alert = alertRepository.findById(alertId)
                .orElseThrow(() -> new RuntimeException("Alert not found"));

        LocationTracking tracking = new LocationTracking();
        tracking.setAlert(alert);
        tracking.setLatitude(latitude);
        tracking.setLongitude(longitude);
        tracking.setAddress(address);

        return locationTrackingRepository.save(tracking);
    }

    public Alert getAlertById(Long alertId) {
        return alertRepository.findById(alertId)
                .orElseThrow(() -> new RuntimeException("Alert not found"));
    }

    public List<Alert> getUserAlerts(Long userId) {
        return alertRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<Alert> getActiveAlerts() {
        return alertRepository.findByIsActiveTrueOrderByCreatedAtDesc();
    }

    public Alert cancelAlert(Long alertId, Long userId) {
        Alert alert = getAlertById(alertId);

        if (!alert.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        alert.setIsActive(false);
        alert.setStatus(Alert.AlertStatus.CANCELLED);
        alert.setResolvedAt(LocalDateTime.now());

        return alertRepository.save(alert);
    }

    public Alert updateAlertStatus(Long alertId, Alert.AlertStatus status) {
        Alert alert = getAlertById(alertId);

        alert.setStatus(status);
        if (status == Alert.AlertStatus.CLOSED || status == Alert.AlertStatus.RESOLVED) {
            alert.setIsActive(false);
            alert.setResolvedAt(LocalDateTime.now());
        }

        return alertRepository.save(alert);
    }

    public List<LocationTracking> getAlertLocationHistory(Long alertId) {
        return locationTrackingRepository.findByAlertIdOrderByTrackedAtDesc(alertId);
    }

    public long getActiveAlertCount() {
        return alertRepository.countByIsActiveTrue();
    }

    // Get all evidence for a user
    public List<Map<String, Object>> getAllUserEvidence(Long userId) {
        List<Alert> userAlerts = alertRepository.findByUserIdOrderByCreatedAtDesc(userId);
        List<Map<String, Object>> allEvidence = new ArrayList<>();

        for (Alert alert : userAlerts) {
            List<AlertMedia> mediaList = alertMediaRepository.findByAlertId(alert.getId());
            for (AlertMedia media : mediaList) {
                Map<String, Object> evidenceMap = new HashMap<>();
                evidenceMap.put("id", media.getId());
                evidenceMap.put("alertId", alert.getId());
                evidenceMap.put("fileName", media.getFileName());
                evidenceMap.put("filePath", media.getFilePath());
                evidenceMap.put("mediaType", media.getMediaType().toString());
                evidenceMap.put("createdAt", media.getCreatedAt());
                evidenceMap.put("alertStatus", alert.getStatus());
                evidenceMap.put("alertLocation", alert.getLocation());
                allEvidence.add(evidenceMap);
            }
        }

        return allEvidence;
    }

    // Get evidence by ID
    public AlertMedia getEvidenceById(Long evidenceId) {
        return alertMediaRepository.findById(evidenceId)
                .orElseThrow(() -> new RuntimeException("Evidence not found"));
    }

    // Get all evidence for an alert
    public List<AlertMedia> getAlertEvidence(Long alertId) {
        return alertMediaRepository.findByAlertId(alertId);
    }

    public void saveAlertMedia(Long alertId, Long userId, List<MultipartFile> photos, MultipartFile audio) throws IOException {
        Alert alert = getAlertById(alertId);

        // Verify user owns this alert
        if (!alert.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        // Create upload directory if it doesn't exist
        Path uploadPath = Paths.get(uploadDir, "alert_" + alertId);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        List<AlertMedia> mediaList = new ArrayList<>();

        // Save photos
        if (photos != null && !photos.isEmpty()) {
            for (int i = 0; i < photos.size(); i++) {
                MultipartFile photo = photos.get(i);
                if (!photo.isEmpty()) {
                    String fileName = "photo_" + i + "_" + UUID.randomUUID() + ".jpg";
                    Path filePath = uploadPath.resolve(fileName);
                    Files.write(filePath, photo.getBytes());

                    AlertMedia media = new AlertMedia();
                    media.setAlert(alert);
                    media.setFileName(fileName);
                    media.setFilePath(filePath.toString());
                    media.setMediaType(AlertMedia.MediaType.IMAGE);
                    mediaList.add(alertMediaRepository.save(media));
                }
            }
        }

        // Save audio
        if (audio != null && !audio.isEmpty()) {
            String fileName = "audio_" + UUID.randomUUID() + ".webm";
            Path filePath = uploadPath.resolve(fileName);
            Files.write(filePath, audio.getBytes());

            AlertMedia media = new AlertMedia();
            media.setAlert(alert);
            media.setFileName(fileName);
            media.setFilePath(filePath.toString());
            media.setMediaType(AlertMedia.MediaType.AUDIO);
            mediaList.add(alertMediaRepository.save(media));
        }

        // Send media update to emergency contacts via SMS/WhatsApp
        try {
            User user = alert.getUser();
            List<EmergencyContact> contacts = emergencyContactService.getUserContacts(userId);

            // Build message with media details
            String message = String.format(
                    "🚨 EMERGENCY ALERT UPDATE from %s!\n\n"
                    + "📍 Location: %s\n"
                    + "🕐 Time: %s\n\n"
                    + "📸 Photos captured: %d\n"
                    + "🎤 Audio recorded: %s\n\n"
                    + "🔴 Track live location:\n"
                    + "http://localhost:8080/location-tracking.html?alertId=%d\n\n"
                    + "View evidence:\n"
                    + "http://localhost:8080/evidence.html",
                    user.getName(),
                    alert.getLocation(),
                    LocalDateTime.now(),
                    photos != null ? photos.size() : 0,
                    audio != null ? "Yes (" + (audio.getSize() / 1024) + " KB)" : "No",
                    alertId
            );

            for (EmergencyContact contact : contacts) {
                try {
                    // Send SMS with alert details
                    smsService.sendSms(contact.getPhone(), message);
                    System.out.println("✅ SMS sent to " + contact.getName() + " (" + contact.getPhone() + ")");
                } catch (Exception e) {
                    System.err.println("Failed to send SMS to " + contact.getName() + ": " + e.getMessage());
                }

                try {
                    // Send via WhatsApp
                    smsService.sendWhatsAppMessage(contact.getPhone(), message);
                    System.out.println("✅ WhatsApp sent to " + contact.getName() + " (" + contact.getPhone() + ")");
                } catch (Exception e) {
                    System.err.println("Failed to send WhatsApp to " + contact.getName() + ": " + e.getMessage());
                }
            }
            
            System.out.println("✅ Media notifications sent to " + contacts.size() + " emergency contacts");
        } catch (Exception e) {
            System.err.println("Failed to send media notifications: " + e.getMessage());
            e.printStackTrace();
        }

        System.out.println("Saved " + mediaList.size() + " media files for alert " + alertId);
    }
}
