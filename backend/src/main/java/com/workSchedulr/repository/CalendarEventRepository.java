package com.workSchedulr.repository;

import com.workSchedulr.model.CalendarEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface CalendarEventRepository extends JpaRepository<CalendarEvent, UUID> {
    @Query("SELECT c FROM User u JOIN u.calendarEvents c WHERE u.id = :userId")
    List<CalendarEvent> findCalendarEventByOwner(UUID userId);

    @Query("SELECT ce FROM CalendarEvent ce WHERE ce.user.id = :userId " +
            "AND ((ce.startTime <= :start AND ce.endTime > :start) " +
            "OR (ce.startTime < :end AND ce.endTime >= :end) " +
            "OR (ce.startTime >= :start AND ce.endTime <= :end))")
    List<CalendarEvent> findOverlappingEvents(UUID userId, ZonedDateTime start, ZonedDateTime end);
}
