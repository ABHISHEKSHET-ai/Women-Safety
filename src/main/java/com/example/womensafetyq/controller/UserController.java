package com.example.womensafetyq.controller;

import com.example.womensafetyq.dto.EmergencyContactRequest;
import com.example.womensafetyq.dto.ProfileUpdateRequest;
import com.example.womensafetyq.dto.UserRegistrationRequest;
import com.example.womensafetyq.entity.EmergencyContact;
import com.example.womensafetyq.entity.User;
import com.example.womensafetyq.service.EmergencyContactService;
import com.example.womensafetyq.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private EmergencyContactService emergencyContactService;

    @GetMapping("/profile")
    public ResponseEntity<User> getProfile(Authentication authentication) {
        Long userId = Long.parseLong(authentication.getPrincipal().toString());
        User user = userService.getUserById(userId);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/profile")
    public ResponseEntity<User> updateProfile(
            Authentication authentication,
            @Valid @RequestBody ProfileUpdateRequest request) {
        Long userId = Long.parseLong(authentication.getPrincipal().toString());
        User user = userService.updateProfile(userId, request);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/emergency-contacts")
    public ResponseEntity<List<EmergencyContact>> getEmergencyContacts(Authentication authentication) {
        Long userId = Long.parseLong(authentication.getPrincipal().toString());
        List<EmergencyContact> contacts = emergencyContactService.getUserContacts(userId);
        return ResponseEntity.ok(contacts);
    }

    @PostMapping("/emergency-contacts")
    public ResponseEntity<?> addEmergencyContact(
            Authentication authentication,
            @Valid @RequestBody EmergencyContactRequest request) {
        try {
            Long userId = Long.parseLong(authentication.getPrincipal().toString());
            EmergencyContact contact = emergencyContactService.addContact(userId, request);
            return ResponseEntity.ok(contact);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PutMapping("/emergency-contacts/{contactId}")
    public ResponseEntity<EmergencyContact> updateEmergencyContact(
            Authentication authentication,
            @PathVariable Long contactId,
            @Valid @RequestBody EmergencyContactRequest request) {
        Long userId = Long.parseLong(authentication.getPrincipal().toString());
        EmergencyContact contact = emergencyContactService.updateContact(userId, contactId, request);
        return ResponseEntity.ok(contact);
    }

    @DeleteMapping("/emergency-contacts/{contactId}")
    public ResponseEntity<Void> deleteEmergencyContact(
            Authentication authentication,
            @PathVariable Long contactId) {
        Long userId = Long.parseLong(authentication.getPrincipal().toString());
        emergencyContactService.deleteContact(userId, contactId);
        return ResponseEntity.noContent().build();
    }
}
