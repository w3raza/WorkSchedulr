package com.workSchedulr.dto;

import lombok.Data;

import java.time.ZonedDateTime;
import java.util.UUID;

@Data
public class CalendarEventDTO {
    private UUID id;
    private String title;
    private ZonedDateTime start;
    private ZonedDateTime end;
    private ProjectDTO project;
    private UserDTO user;

    public ZonedDateTime getStartTime(){
        return start;
    }

    public ZonedDateTime getEndTime(){
        return end;
    }
}
