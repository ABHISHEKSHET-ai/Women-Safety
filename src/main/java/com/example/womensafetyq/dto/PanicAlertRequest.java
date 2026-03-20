package com.example.womensafetyq.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PanicAlertRequest {

    @NotNull(message = "Latitude is required")
    private Double latitude;

    @NotNull(message = "Longitude is required")
    private Double longitude;

    private String location;
}
