package com.workSchedulr.mapper;

import com.workSchedulr.model.CalendarEvent;
import org.mapstruct.Mapper;

import java.util.UUID;

@Mapper(imports = UUID.class, componentModel = "spring", uses = { CalendarEvent.class})
public abstract class CalendarEventMapper {
    //public abstract CalendarEvent mapToCalendarEvent();
}
