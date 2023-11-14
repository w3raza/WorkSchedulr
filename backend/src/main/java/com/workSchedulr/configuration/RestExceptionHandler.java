package com.workSchedulr.configuration;

import com.workSchedulr.exception.CustomException;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class RestExceptionHandler {

    @ExceptionHandler(value = { CustomException.class })
    @ResponseBody
    public ResponseEntity<?> handleException(CustomException ex) {
        return ResponseEntity
                .status(ex.getHttpStatus())
                .body((ex.getMessage()));
    }

    @ExceptionHandler(value = { ConstraintViolationException.class })
    @ResponseBody
    public ResponseEntity<?> handleConstraintViolationException(ConstraintViolationException ex) {
        StringBuilder errorMessage = new StringBuilder();
        for (ConstraintViolation<?> violation : ex.getConstraintViolations()) {
            errorMessage.append(violation.getMessage()).append("\n");
        }

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body((errorMessage.toString()));
    }
}