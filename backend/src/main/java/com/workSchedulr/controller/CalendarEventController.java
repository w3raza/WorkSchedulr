package com.workSchedulr.controller;

import com.workSchedulr.dto.CalendarEventDTO;
import com.workSchedulr.mapper.CalendarEventMapper;
import com.workSchedulr.model.CalendarEvent;
import com.workSchedulr.service.CalendarEventService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/calendarEvent")
public class CalendarEventController {
    private final CalendarEventService calendarEventService;
    private final CalendarEventMapper calendarEventMapper;

    @GetMapping()
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<List<CalendarEvent>> getCalendarEventsForUser(@RequestParam("userId") UUID userId){
        return ResponseEntity.ok(calendarEventService.getCalendarEventsForUser(userId));
    }

    @PostMapping()
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<?> createCalendarEvents(@RequestBody CalendarEventDTO calendarEventDTO){
        CalendarEvent calendarEvent = calendarEventMapper.mapToCalendarEvent(calendarEventDTO);
        return ResponseEntity.ok(calendarEventService.createCalendarEvents(calendarEvent));
    }
}
