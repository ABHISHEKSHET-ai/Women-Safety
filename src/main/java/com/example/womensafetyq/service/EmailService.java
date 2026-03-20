package com.example.womensafetyq.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendVerificationEmail(String toEmail, String verificationCode) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Women Safety - Email Verification");
        message.setText("Your verification code is: " + verificationCode
                + "\n\nThank you for registering with Women Safety App!");

        mailSender.send(message);
    }

    public void sendPasswordResetEmail(String toEmail, String resetToken) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Women Safety - Password Reset");
        message.setText("Click the link to reset your password: "
                + "http://localhost:8080/reset-password.html?token=" + resetToken
                + "\n\nThis link will expire in 24 hours.");

        mailSender.send(message);
    }

    public void sendAlertEmail(String toEmail, String userName, String location, String alertId) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("EMERGENCY ALERT - " + userName);
        message.setText("EMERGENCY ALERT!\n\n"
                + userName + " has triggered a panic alert.\n\n"
                + "Location: " + location + "\n"
                + "Time: " + java.time.LocalDateTime.now() + "\n\n"
                + "Track location: http://localhost:8080/location-tracking.html?alertId=" + alertId);

        mailSender.send(message);
    }

    public void sendEmergencyMediaAlert(String toEmail, String subject, String messageText) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject(subject);
        message.setText(messageText);

        try {
            mailSender.send(message);
            System.out.println("Emergency media alert email sent to " + toEmail);
        } catch (Exception e) {
            System.err.println("Failed to send email to " + toEmail + ": " + e.getMessage());
            throw e;
        }
    }
}
