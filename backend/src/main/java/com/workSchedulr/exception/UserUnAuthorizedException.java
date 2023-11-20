package com.workSchedulr.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class UserUnAuthorizedException extends ResponseStatusException {
    public UserUnAuthorizedException(){
        super(HttpStatus.UNAUTHORIZED, "User is not authorized to access.");
    }
}
