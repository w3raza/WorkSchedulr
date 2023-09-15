package com.authentification.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class UserAlreadyExistsException extends ResponseStatusException {
    public UserAlreadyExistsException(){
        super(HttpStatus.FORBIDDEN, "Username is already in use");
    }
}
