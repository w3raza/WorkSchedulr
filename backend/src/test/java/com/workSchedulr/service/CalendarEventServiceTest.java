package com.workSchedulr.service;

import com.workSchedulr.exception.CalendarEventNotFoundException;
import com.workSchedulr.model.CalendarEvent;
import com.workSchedulr.model.User;
import com.workSchedulr.repository.CalendarEventRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.time.ZonedDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class CalendarEventServiceTest {

    @Mock
    private CalendarEventRepository calendarEventRepository;

    @Mock
    private UserService userService;

    @InjectMocks
    private CalendarEventService calendarEventService;

    private CalendarEvent calendarEvent;
    private User user;
    private UUID calendarEventId;
    private UUID userId;

    @BeforeEach
    public void setUp() {
        calendarEventId = UUID.randomUUID();
        userId = UUID.randomUUID();

        user = new User();
        user.setId(userId);

        calendarEvent = new CalendarEvent();
        calendarEvent.setId(calendarEventId);
        calendarEvent.setTitle("Test Event");
        calendarEvent.setStart(ZonedDateTime.now());
        calendarEvent.setEnd(ZonedDateTime.now().plusHours(2));
        calendarEvent.setUser(user);
    }

    @Test
    public void whenGetCalendarEventById_thenSuccess() {
        when(calendarEventRepository.findById(calendarEventId)).thenReturn(Optional.of(calendarEvent));
        CalendarEvent foundEvent = calendarEventService.getCalendarEventById(calendarEventId);
        assertNotNull(foundEvent);
        assertEquals(calendarEventId, foundEvent.getId());
    }

    @Test
    public void whenGetCalendarEventById_thenThrowException() {
        when(calendarEventRepository.findById(calendarEventId)).thenReturn(Optional.empty());
        assertThrows(CalendarEventNotFoundException.class, () -> calendarEventService.getCalendarEventById(calendarEventId));
    }

    @Test
    public void whenGetCalendarEventsForUser_thenSuccess() {
//        when(userService.getCurrentUser()).thenReturn(user);
//        when(calendarEventRepository.findCalendarEventByOwner(userId)).thenReturn(Collections.singletonList(calendarEvent));
//        List<CalendarEvent> events = calendarEventService.getCalendarEventsForUser(userId);
//        assertFalse(events.isEmpty());
//        assertEquals(calendarEvent.getTitle(), events.get(0).getTitle());
    }

    @Test
    public void whenCreateCalendarEvent_thenSuccess() {
        //when(userService.getCurrentUser()).thenReturn(user);
        //when(calendarEventRepository.save(any(CalendarEvent.class))).thenReturn(calendarEvent);
        //CalendarEvent createdEvent = calendarEventService.createCalendarEvent(calendarEvent);
        //assertNotNull(createdEvent);
    }

    @Test
    public void whenCreateInvalidCalendarEvent_thenThrowResponseStatusException() {
//        when(userService.getCurrentUser()).thenReturn(user);
//        when(calendarEventRepository.findOverlappingEvents(any(), any(), any())).thenReturn(Collections.singletonList(calendarEvent));
//        ResponseStatusException thrown = assertThrows(ResponseStatusException.class, () -> calendarEventService.createCalendarEvent(calendarEvent));
//        assertEquals(HttpStatus.NOT_ACCEPTABLE, thrown.getStatusCode());
    }

    @Test
    public void whenUpdateCalendarEvent_thenSuccess() {
        when(calendarEventRepository.findById(calendarEventId)).thenReturn(Optional.of(calendarEvent));
        when(calendarEventRepository.save(any(CalendarEvent.class))).thenReturn(calendarEvent);
        when(calendarEventRepository.findOverlappingEvents(any(), any(), any())).thenReturn(Collections.emptyList());

        CalendarEvent updatedEvent = new CalendarEvent();
        updatedEvent.setId(calendarEventId);
        updatedEvent.setTitle("Updated Event");

        CalendarEvent result = calendarEventService.updateCalendarEvent(updatedEvent);
        assertNotNull(result);
        assertEquals("Updated Event", result.getTitle());
    }

    @Test
    public void whenDeleteEvent_thenSuccess() {
        doNothing().when(calendarEventRepository).deleteById(calendarEventId);
        assertDoesNotThrow(() -> calendarEventService.deleteEvent(calendarEventId));
    }
}