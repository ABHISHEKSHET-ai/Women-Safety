package com.example.womensafetyq.controller;

import com.example.womensafetyq.dto.AuthResponse;
import com.example.womensafetyq.dto.LoginRequest;
import com.example.womensafetyq.entity.Admin;
import com.example.womensafetyq.entity.Alert;
import com.example.womensafetyq.entity.UnsafeArea;
import com.example.womensafetyq.entity.User;
import com.example.womensafetyq.repository.AdminRepository;
import com.example.womensafetyq.service.AdminService;
import com.example.womensafetyq.service.AlertService;
import com.example.womensafetyq.service.UnsafeAreaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private AlertService alertService;

    @Autowired
    private UnsafeAreaService unsafeAreaService;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/auth/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = adminService.loginAdmin(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/dashboard/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = adminService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = adminService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @PutMapping("/users/{userId}/block")
    public ResponseEntity<User> blockUser(@PathVariable Long userId) {
        User user = adminService.blockUser(userId);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/users/{userId}/unblock")
    public ResponseEntity<User> unblockUser(@PathVariable Long userId) {
        User user = adminService.unblockUser(userId);
        return ResponseEntity.ok(user);
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long userId) {
        adminService.deleteUser(userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/alerts")
    public ResponseEntity<List<Alert>> getActiveAlerts() {
        List<Alert> alerts = alertService.getActiveAlerts();
        return ResponseEntity.ok(alerts);
    }

    @PutMapping("/alerts/{alertId}/status")
    public ResponseEntity<Alert> updateAlertStatus(
            @PathVariable Long alertId,
            @RequestParam String status) {
        Alert alert = alertService.updateAlertStatus(alertId, Alert.AlertStatus.valueOf(status));
        return ResponseEntity.ok(alert);
    }

    @GetMapping("/reports")
    public ResponseEntity<List<UnsafeArea>> getPendingReports() {
        List<UnsafeArea> reports = unsafeAreaService.getPendingReports();
        return ResponseEntity.ok(reports);
    }

    @PutMapping("/reports/{reportId}/status")
    public ResponseEntity<UnsafeArea> updateReportStatus(
            @PathVariable Long reportId,
            @RequestParam String status) {
        UnsafeArea area = unsafeAreaService.updateReportStatus(reportId, UnsafeArea.ReportStatus.valueOf(status));
        return ResponseEntity.ok(area);
    }

    // Debug endpoint to create admin user - REMOVE IN PRODUCTION
    @PostMapping("/setup-admin")
    public ResponseEntity<Map<String, String>> setupAdmin() {
        Map<String, String> response = new HashMap<>();

        // Delete existing admin if present
        adminRepository.findByUsername("admin").ifPresent(existingAdmin -> {
            adminRepository.delete(existingAdmin);
            response.put("deleted", "Existing admin user deleted");
        });

        // Create fresh admin user with correct password
        Admin admin = new Admin();
        admin.setName("System Admin");
        admin.setUsername("admin");
        admin.setEmail("admin@womensafety.com");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setCreatedAt(LocalDateTime.now());

        adminRepository.save(admin);

        response.put("message", "Admin user created successfully");
        response.put("username", "admin");
        response.put("password", "admin123");
        return ResponseEntity.ok(response);
    }

    // Debug endpoint to check admin - REMOVE IN PRODUCTION
    @GetMapping("/check-admin")
    public ResponseEntity<Map<String, Object>> checkAdmin() {
        Map<String, Object> response = new HashMap<>();

        var adminOpt = adminRepository.findByUsername("admin");
        if (adminOpt.isPresent()) {
            Admin admin = adminOpt.get();
            response.put("exists", true);
            response.put("id", admin.getId());
            response.put("username", admin.getUsername());
            response.put("email", admin.getEmail());
            response.put("name", admin.getName());
        } else {
            response.put("exists", false);
            response.put("message", "Admin user not found in database");
        }

        return ResponseEntity.ok(response);
    }
}
