package com.workSchedulr.dto;

import lombok.Data;

import java.time.ZonedDateTime;
import java.util.UUID;

@Data
public class CalendarEventDTO {
    private UUID id;
    private String title;
    private ZonedDateTime startTime;
    private ZonedDateTime endTime;
    private ProjectDTO project;
    private UserDTO user;
}
