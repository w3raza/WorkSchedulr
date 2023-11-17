package com.workSchedulr.dto;

import lombok.Data;

import java.time.ZonedDateTime;
import java.util.UUID;

@Data
public class CalendarEventDTO {
    private UUID id;
    private String description;
    private ZonedDateTime startTime;
    private ZonedDateTime endTime;
    private ProjectDTO project;
    private UserDTO user;
}
