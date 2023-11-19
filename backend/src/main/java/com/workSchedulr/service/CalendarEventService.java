package com.workSchedulr.service;

import com.workSchedulr.exception.CalendarEventNotFoundException;
import com.workSchedulr.model.CalendarEvent;
import com.workSchedulr.repository.CalendarEventRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@AllArgsConstructor
public class CalendarEventService {
    private final CalendarEventRepository calendarEventRepository;
    private final UserService userService;

    public CalendarEvent getCalendarEventById(UUID calendarEventId){
        return calendarEventRepository.findById(calendarEventId).orElseThrow(CalendarEventNotFoundException::new);
    }
    public List<CalendarEvent> getCalendarEventsForUser(UUID userId){
        if(userId == null){
            userId = userService.getCurrentUser().getId();
        }
        return calendarEventRepository.findCalendarEventByOwner(userId);
    }

    public CalendarEvent createCalendarEvent(CalendarEvent calendarEvent){
        if(isValid(calendarEvent, null)) {
            if (calendarEvent.getUser() == null) {
                calendarEvent.setUser(userService.getCurrentUser());
            }
            return calendarEventRepository.save(calendarEvent);
        }else{
            throw new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE, "Events cannot overlap");
        }
    }

    public CalendarEvent updateCalendarEvent(CalendarEvent updatedCalendarEvent){
        CalendarEvent calendarEvent = getCalendarEventById(updatedCalendarEvent.getId());

        Optional.ofNullable(updatedCalendarEvent.getTitle()).ifPresent(calendarEvent::setTitle);
        Optional.ofNullable(updatedCalendarEvent.getStart()).ifPresent(calendarEvent::setStart);
        Optional.ofNullable(updatedCalendarEvent.getEnd()).ifPresent(calendarEvent::setEnd);
        Optional.ofNullable(updatedCalendarEvent.getProject()).ifPresent(calendarEvent::setProject);
        Optional.ofNullable(updatedCalendarEvent.getUser()).ifPresent(calendarEvent::setUser);

        if(isValid(calendarEvent, updatedCalendarEvent.getId())) {
            return calendarEventRepository.save(calendarEvent);
        }else{
            throw new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE, "Events cannot overlap");
        }
    }

    public void deleteEvent(UUID id) {
        calendarEventRepository.deleteById(id);
    }

    private Boolean isValid(CalendarEvent event, UUID eventIdToExclude) {
        ZonedDateTime start = event.getStart();
        ZonedDateTime end = event.getEnd();
        UUID userId = event.getUser().getId();

        List<CalendarEvent> overlappingEvents = calendarEventRepository.findOverlappingEvents(userId, start, end)
                .stream()
                .filter(e -> !e.getId().equals(eventIdToExclude))
                .toList();

        return overlappingEvents.isEmpty();    }
}
