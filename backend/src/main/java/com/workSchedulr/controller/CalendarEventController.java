package com.workSchedulr.controller;

import com.workSchedulr.dto.CalendarEventDTO;
import com.workSchedulr.mapper.CalendarEventMapper;
import com.workSchedulr.model.CalendarEvent;
import com.workSchedulr.service.CalendarEventService;
import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotNull;
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
    public ResponseEntity<List<CalendarEvent>> getCalendarEventsForUser(@Nullable @RequestParam("userId") UUID userId){
        return ResponseEntity.ok(calendarEventService.getCalendarEventsForUser(userId));
    }

    @PostMapping()
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<?> createCalendarEvents(@RequestBody CalendarEventDTO calendarEventDTO){
        CalendarEvent calendarEvent = calendarEventMapper.mapToCalendarEvent(calendarEventDTO);
        return ResponseEntity.ok(calendarEventService.createCalendarEvent(calendarEvent));
    }

    @PatchMapping()
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<?> updateEvent(@RequestBody CalendarEventDTO calendarEventDTO){
        CalendarEvent calendarEvent = calendarEventMapper.mapToCalendarEvent(calendarEventDTO);
        return ResponseEntity.ok(calendarEventService.updateCalendarEvent(calendarEvent));
    }

    @DeleteMapping()
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<String> deleteEvent(@NotNull @RequestParam UUID id) {
        calendarEventService.deleteEvent(id);
        return ResponseEntity.ok("Delete event.");
    }
}
