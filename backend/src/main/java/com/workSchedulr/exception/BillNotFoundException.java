package com.workSchedulr.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class BillNotFoundException extends ResponseStatusException {
    public BillNotFoundException(){
        super(HttpStatus.NOT_FOUND, "Bill not found");
    }
}
