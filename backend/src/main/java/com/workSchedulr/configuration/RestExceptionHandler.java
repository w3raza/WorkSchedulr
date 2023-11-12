package com.workSchedulr.configuration;

import com.workSchedulr.dto.ErrorDto;
import com.workSchedulr.exception.CustomException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

@ControllerAdvice
public class RestExceptionHandler {

    @ExceptionHandler(value = { CustomException.class })
    @ResponseBody
    public ResponseEntity<ErrorDto> handleException(CustomException ex) {
        return ResponseEntity
                .status(ex.getHttpStatus())
                .body(new ErrorDto(ex.getMessage()));
    }
}