package com.workSchedulr.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.ZonedDateTime;
import java.util.UUID;

@Data
public class CalendarEventDTO {
    private UUID id;
    @NotNull
    @Size(min = 5, max = 255, message = "Minimum title length: 5 characters")
    private String title;
    private ZonedDateTime startTime;
    private ZonedDateTime endTime;
    private ProjectDTO project;
    private UserDTO owner;
}
