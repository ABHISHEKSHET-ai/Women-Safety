package com.example.womensafetyq.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UnsafeAreaRequest {

    @NotNull(message = "Latitude is required")
    private Double latitude;

    @NotNull(message = "Longitude is required")
    private Double longitude;

    private String location;

    @NotBlank(message = "Description is required")
    private String description;

    @NotBlank(message = "Risk level is required")
    private String riskLevel; // LOW, MEDIUM, HIGH
}
