package com.example.womensafetyq.service;

import com.example.womensafetyq.dto.AuthResponse;
import com.example.womensafetyq.dto.LoginRequest;
import com.example.womensafetyq.entity.Admin;
import com.example.womensafetyq.entity.User;
import com.example.womensafetyq.repository.AdminRepository;
import com.example.womensafetyq.repository.UserRepository;
import com.example.womensafetyq.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class AdminService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private AlertService alertService;

    @Autowired
    private UnsafeAreaService unsafeAreaService;

    public AuthResponse loginAdmin(LoginRequest request) {
        Admin admin = adminRepository.findByUsername(request.getIdentifier())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), admin.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        String token = jwtTokenProvider.generateToken(admin.getId(), admin.getEmail(), "ADMIN");

        return new AuthResponse(token, admin.getId(), admin.getName(), admin.getEmail());
    }

    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("activeAlerts", alertService.getActiveAlertCount());
        stats.put("pendingReports", unsafeAreaService.getPendingReportCount());
        return stats;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User blockUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setIsBlocked(true);
        return userRepository.save(user);
    }

    public User unblockUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setIsBlocked(false);
        return userRepository.save(user);
    }

    public void deleteUser(Long userId) {
        userRepository.deleteById(userId);
    }
}
