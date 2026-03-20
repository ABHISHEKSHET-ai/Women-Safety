package com.example.womensafetyq.controller;

import com.example.womensafetyq.dto.UnsafeAreaRequest;
import com.example.womensafetyq.entity.UnsafeArea;
import com.example.womensafetyq.service.UnsafeAreaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/unsafe-areas")
public class UnsafeAreaController {
    
    @Autowired
    private UnsafeAreaService unsafeAreaService;
    
    @PostMapping("/report")
    public ResponseEntity<UnsafeArea> reportUnsafeArea(
            Authentication authentication,
            @Valid @RequestBody UnsafeAreaRequest request) {
        Long userId = Long.parseLong(authentication.getPrincipal().toString());
        UnsafeArea area = unsafeAreaService.reportUnsafeArea(userId, request);
        return ResponseEntity.ok(area);
    }
    
    @GetMapping("/community")
    public ResponseEntity<List<UnsafeArea>> getCommunityReports() {
        // Show all unsafe areas (both approved and pending) to all users
        List<UnsafeArea> areas = unsafeAreaService.getAllAreas();
        return ResponseEntity.ok(areas);
    }
}
