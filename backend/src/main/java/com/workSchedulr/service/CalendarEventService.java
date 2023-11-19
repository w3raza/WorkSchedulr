package com.workSchedulr.service;

import com.workSchedulr.model.CalendarEvent;
import com.workSchedulr.repository.CalendarEventRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
public class CalendarEventService {
    private final CalendarEventRepository calendarEventRepository;
    private final UserService userService;

    public List<CalendarEvent> getCalendarEventsForUser(UUID userId){
        return calendarEventRepository.findCalendarEventByOwner(userId);
    }

    public CalendarEvent createCalendarEvents(CalendarEvent calendarEvent){
        if(isValid(calendarEvent)) {
            if (calendarEvent.getUser() == null) {
                calendarEvent.setUser(userService.getCurrentUser());
            }
            return calendarEventRepository.save(calendarEvent);
        }else{
            throw new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE, "Events cannot overlap");
        }
    }

    private Boolean isValid(CalendarEvent event) {
        ZonedDateTime start = event.getStartTime();
        ZonedDateTime end = event.getEndTime();

        return calendarEventRepository.findOverlappingEvents(event.getUser().getId(), start, end).isEmpty();
    }
}
