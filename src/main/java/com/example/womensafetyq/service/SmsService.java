package com.example.womensafetyq.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.Map;

@Service
public class SmsService {

    @Value("${twilio.account.sid:}")
    private String twilioAccountSid;

    @Value("${twilio.auth.token:}")
    private String twilioAuthToken;

    @Value("${twilio.phone.number:}")
    private String twilioPhoneNumber;

    @Value("${whatsapp.api.key:}")
    private String whatsAppApiKey;

    @Value("${whatsapp.api.url:}")
    private String whatsAppApiUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * Send SMS (Development mode - logs to console)
     * Emergency contacts will see the message in the console output
     */
    public void sendSms(String toPhoneNumber, String message) {
        // Log to console (for development)
        System.out.println("\n=== SMS NOTIFICATION ===");
        System.out.println("To: " + toPhoneNumber);
        System.out.println("Message:");
        System.out.println(message);
        System.out.println("========================\n");
    }

    /**
     * Send WhatsApp message (Development mode - logs to console)
     */
    public void sendWhatsAppMessage(String toPhoneNumber, String message) {
        // Log to console (for development)
        System.out.println("\n=== WHATSAPP NOTIFICATION ===");
        System.out.println("To: " + toPhoneNumber);
        System.out.println("Message:");
        System.out.println(message);
        System.out.println("=============================\n");
    }

    /**
     * Send emergency alert via multiple channels
     */
    public void sendEmergencyAlert(String toPhoneNumber, String userName, String location, String alertId) {
        String message = String.format(
                "🚨 EMERGENCY ALERT 🚨\n\n"
                + "From: %s\n"
                + "Location: %s\n"
                + "Time: %s\n\n"
                + "Track live location:\n"
                + "http://localhost:8080/location-tracking.html?alertId=%s\n\n"
                + "This is an automated emergency alert.",
                userName,
                location,
                java.time.LocalDateTime.now().toString(),
                alertId
        );

        // Send via both SMS and WhatsApp
        try {
            sendSms(toPhoneNumber, message);
        } catch (Exception e) {
            System.err.println("SMS failed for " + toPhoneNumber);
        }

        try {
            sendWhatsAppMessage(toPhoneNumber, message);
        } catch (Exception e) {
            System.err.println("WhatsApp failed for " + toPhoneNumber);
        }
    }
}
