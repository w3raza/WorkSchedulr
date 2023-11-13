package com.workSchedulr.controller;

import com.workSchedulr.model.CalendarEvent;
import com.workSchedulr.service.CalendarEventService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@AllArgsConstructor
@RequestMapping("/calendarEvent")
public class CalendarEventController {
    private final CalendarEventService calendarEventService;

    @GetMapping()
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<List<CalendarEvent>> getCalendarEventsForUser(@RequestParam("userId") UUID userId){
        return ResponseEntity.ok(calendarEventService.getCalendarEventsForUser(userId));
    }
}
