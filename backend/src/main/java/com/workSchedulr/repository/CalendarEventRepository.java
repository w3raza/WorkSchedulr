package com.workSchedulr.repository;

import com.workSchedulr.model.CalendarEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CalendarEventRepository extends JpaRepository<CalendarEvent, UUID> {
    @Query("SELECT c FROM User u JOIN u.calendarEvents c WHERE u.id = :userId")

    List<CalendarEvent> findCalendarEventByOwner(UUID userId);
}
