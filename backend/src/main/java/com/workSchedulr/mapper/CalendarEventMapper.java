package com.workSchedulr.mapper;

import com.workSchedulr.dto.CalendarEventDTO;
import com.workSchedulr.model.CalendarEvent;
import org.mapstruct.Mapper;

import java.util.UUID;

@Mapper(imports = UUID.class, componentModel = "spring", uses = { UserMapper.class, ProjectMapper.class})
public abstract class CalendarEventMapper {
    public abstract CalendarEvent mapToCalendarEvent(CalendarEventDTO calendarEventDTO);
}
