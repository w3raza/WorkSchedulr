package com.workSchedulr.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class CalendarEventNotFoundException extends ResponseStatusException {
    public CalendarEventNotFoundException(){
        super(HttpStatus.NOT_FOUND, "Calendar event not found");
    }

}
