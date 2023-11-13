package com.workSchedulr.service;

import com.workSchedulr.model.CalendarEvent;
import com.workSchedulr.repository.CalendarEventRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
public class CalendarEventService {
    private final CalendarEventRepository calendarEventRepository;

    public List<CalendarEvent> getCalendarEventsForUser(UUID userId){
        return calendarEventRepository.findCalendarEventByOwner(userId);
    }
}
