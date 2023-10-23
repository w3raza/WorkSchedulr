package com.workSchedulr.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class InvalidPasswordException extends ResponseStatusException {
    public InvalidPasswordException(){
        super(HttpStatus.BAD_REQUEST, "Invalid password supplied");
    }
}
